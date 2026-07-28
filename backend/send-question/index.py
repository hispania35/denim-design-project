import json
import smtplib
import os
import re
import random
import string
import hashlib
import hmac
import time
import base64
import uuid
import psycopg2
import boto3
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

PROMO_TABLE = 't_p27960186_language_studio_land.promo_codes'
PRICING_TABLE = 't_p27960186_language_studio_land.pricing_plans'
SETTINGS_TABLE = 't_p27960186_language_studio_land.admin_settings'
CODES_TABLE = 't_p27960186_language_studio_land.admin_codes'
LOCKOUT_TABLE = 't_p27960186_language_studio_land.admin_lockout'
SECTIONS_TABLE = 't_p27960186_language_studio_land.site_sections'
CONTENT_TABLE = 't_p27960186_language_studio_land.section_content'
BLOG_TABLE = 't_p27960186_language_studio_land.blog_posts'
ADMIN_EMAIL = 'hispania35@yandex.ru'
SESSION_TTL = 8 * 3600  # 8 часов
MAX_ATTEMPTS = 5        # попыток ввода кода
BLOCK_MINUTES = 5       # блокировка после превышения


def _generate_promo() -> str:
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f'Hispania{suffix}'


def _hash_password(password: str) -> str:
    return hashlib.sha256(('hispania_salt_v1' + password).encode()).hexdigest()


def _check_password(cur, password: str) -> bool:
    if not password:
        return False
    cur.execute(f'SELECT password_hash FROM {SETTINGS_TABLE} WHERE id = 1')
    row = cur.fetchone()
    stored = row[0] if row else None
    if stored:
        return hmac.compare_digest(stored, _hash_password(password))
    # пароль в БД ещё не задан — сверяем с секретом ADMIN_PASSWORD
    env_pwd = os.environ.get('ADMIN_PASSWORD')
    return bool(env_pwd) and hmac.compare_digest(env_pwd, password)


def _session_secret() -> bytes:
    base = os.environ.get('ADMIN_PASSWORD', '') + os.environ.get('SMTP_PASSWORD', '')
    return hashlib.sha256(('sess::' + base).encode()).digest()


def _make_token() -> str:
    exp = int(time.time()) + SESSION_TTL
    payload = str(exp).encode()
    sig = hmac.new(_session_secret(), payload, hashlib.sha256).digest()
    raw = payload + b'.' + base64.urlsafe_b64encode(sig)
    return base64.urlsafe_b64encode(raw).decode()


def _check_token(token: str) -> bool:
    try:
        raw = base64.urlsafe_b64decode(token.encode())
        payload, sig_b64 = raw.split(b'.', 1)
        exp = int(payload.decode())
        if exp < int(time.time()):
            return False
        expected = hmac.new(_session_secret(), payload, hashlib.sha256).digest()
        return hmac.compare_digest(base64.urlsafe_b64decode(sig_b64), expected)
    except Exception:
        return False


def _gen_code() -> str:
    return ''.join(random.choices(string.digits, k=8))


def _blocked_seconds(cur, ip: str) -> int:
    """Возвращает сколько секунд осталось до конца блокировки (0 — не заблокирован)."""
    ip_sql = ip.replace("'", "''")
    cur.execute(
        f"SELECT GREATEST(0, CEIL(EXTRACT(EPOCH FROM (blocked_until - now())))) "
        f"FROM {LOCKOUT_TABLE} WHERE ip = '{ip_sql}' AND blocked_until > now()"
    )
    row = cur.fetchone()
    return int(row[0]) if row and row[0] else 0


def _register_fail(cur, ip: str) -> int:
    """Учитывает неудачную попытку. Возвращает секунды блокировки, если лимит превышен."""
    ip_sql = ip.replace("'", "''")
    cur.execute(
        f"INSERT INTO {LOCKOUT_TABLE} (ip, fails, updated_at) VALUES ('{ip_sql}', 1, now()) "
        f"ON CONFLICT (ip) DO UPDATE SET fails = {LOCKOUT_TABLE}.fails + 1, updated_at = now() "
        f"RETURNING fails"
    )
    fails = cur.fetchone()[0]
    if fails >= MAX_ATTEMPTS:
        cur.execute(
            f"UPDATE {LOCKOUT_TABLE} SET blocked_until = now() + interval '{BLOCK_MINUTES} minutes', "
            f"fails = 0 WHERE ip = '{ip_sql}'"
        )
        return BLOCK_MINUTES * 60
    return 0


def _reset_fails(cur, ip: str) -> None:
    ip_sql = ip.replace("'", "''")
    cur.execute(
        f"UPDATE {LOCKOUT_TABLE} SET fails = 0, blocked_until = NULL WHERE ip = '{ip_sql}'"
    )


def _send_code_email(smtp_password: str, code: str, purpose: str) -> None:
    if purpose == 'reset':
        subject = 'Код для сброса пароля — Hispania'
        intro = 'Вы запросили сброс пароля в админ-панели.'
    else:
        subject = 'Код для входа в админ-панель — Hispania'
        intro = 'Вы входите в админ-панель управления ценами.'
    msg = MIMEMultipart()
    msg['From'] = ADMIN_EMAIL
    msg['To'] = ADMIN_EMAIL
    msg['Subject'] = subject
    html = f"""
    <h2>{subject}</h2>
    <p>{intro}</p>
    <p>Ваш одноразовый код:</p>
    <p style="font-size:32px;font-weight:bold;letter-spacing:6px;color:#7c3aed;">{code}</p>
    <p>Код действует 10 минут. Если вы этого не запрашивали — просто проигнорируйте письмо.</p>
    """
    msg.attach(MIMEText(html, 'html'))
    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(ADMIN_EMAIL, smtp_password)
        server.send_message(msg)


def _row_to_plan(row):
    features = [f for f in (row[9] or '').split('|') if f]
    return {
        'name': row[1],
        'description': row[2],
        'price': row[3],
        'oldPrice': row[4],
        'priceByn': row[5],
        'oldPriceByn': row[6],
        'unit': row[7],
        'gradient': row[8],
        'features': features,
        'popular': row[10],
        'cta': row[11],
    }


def _get_plans(cur):
    cur.execute(
        f'SELECT id, name, description, price, old_price, price_byn, old_price_byn, '
        f'unit, gradient, features, popular, cta '
        f'FROM {PRICING_TABLE} ORDER BY sort_order, id'
    )
    return [_row_to_plan(r) for r in cur.fetchall()]


def _get_sections(cur):
    cur.execute(
        f'SELECT section_key, title, visible, sort_order '
        f'FROM {SECTIONS_TABLE} ORDER BY sort_order, section_key'
    )
    return [
        {'key': r[0], 'title': r[1], 'visible': r[2], 'order': r[3]}
        for r in cur.fetchall()
    ]


def _get_content(cur):
    cur.execute(f'SELECT section_key, content FROM {CONTENT_TABLE}')
    return {r[0]: r[1] for r in cur.fetchall()}


def _row_to_post(row, full=False):
    post = {
        'id': row[0],
        'slug': row[1],
        'title': row[2],
        'excerpt': row[3],
        'coverImage': row[5],
        'published': row[6],
        'createdAt': row[7].isoformat() if row[7] else None,
    }
    if full:
        post['content'] = row[4]
    return post


def _get_posts(cur, only_published=True, full=False):
    where = "WHERE published = true" if only_published else ""
    cur.execute(
        f'SELECT id, slug, title, excerpt, content, cover_image, published, created_at '
        f'FROM {BLOG_TABLE} {where} ORDER BY created_at DESC, id DESC'
    )
    return [_row_to_post(r, full=full) for r in cur.fetchall()]


def _slugify(text: str) -> str:
    translit = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya',
    }
    text = text.lower().strip()
    result = []
    for ch in text:
        if ch in translit:
            result.append(translit[ch])
        elif ch.isalnum():
            result.append(ch)
        elif ch in ' -_':
            result.append('-')
    slug = ''.join(result)
    while '--' in slug:
        slug = slug.replace('--', '-')
    slug = slug.strip('-')
    return slug or 'post'


def handler(event: dict, context) -> dict:
    """Вопросы с сайта, промокоды за подписку и управление ценами (тарифами)"""

    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
        'Access-Control-Max-Age': '86400'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    if event.get('httpMethod') == 'GET':
        params = event.get('queryStringParameters') or {}
        post_slug = params.get('post')
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        try:
            with conn.cursor() as cur:
                if post_slug:
                    cur.execute(
                        f'SELECT id, slug, title, excerpt, content, cover_image, published, created_at '
                        f'FROM {BLOG_TABLE} WHERE slug = %s AND published = true LIMIT 1',
                        (post_slug,)
                    )
                    row = cur.fetchone()
                    if not row:
                        return {
                            'statusCode': 404,
                            'headers': {**cors, 'Content-Type': 'application/json'},
                            'body': json.dumps({'error': 'Статья не найдена'}, ensure_ascii=False)
                        }
                    return {
                        'statusCode': 200,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'post': _row_to_post(row, full=True)}, ensure_ascii=False)
                    }
                plans = _get_plans(cur)
                sections = _get_sections(cur)
                content = _get_content(cur)
                posts = _get_posts(cur, only_published=True, full=False)
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps(
                {'plans': plans, 'sections': sections, 'content': content, 'posts': posts},
                ensure_ascii=False
            )
        }

    body = json.loads(event.get('body', '{}'))
    mode = body.get('mode', 'question')
    headers = event.get('headers') or {}

    # --- Шаг 1 входа: проверяем пароль и отправляем 8-значный код на почту ---
    if mode == 'admin_login_request':
        password = body.get('password', '')
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                if not _check_password(cur, password):
                    return {
                        'statusCode': 401,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'ok': False, 'error': 'Неверный пароль'}, ensure_ascii=False)
                    }
                code = _gen_code()
                cur.execute(
                    f"INSERT INTO {CODES_TABLE} (purpose, code, expires_at) "
                    f"VALUES ('login', %s, now() + interval '10 minutes')",
                    (code,)
                )
        finally:
            conn.close()
        _send_code_email(os.environ['SMTP_PASSWORD'], code, 'login')
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True}, ensure_ascii=False)
        }

    # --- Шаг 2 входа: проверяем код, выдаём токен сессии ---
    if mode == 'admin_login_verify':
        code = str(body.get('code', '')).strip()
        ip = 'admin_login'  # админ один — блокировка общая по попыткам входа
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                left = _blocked_seconds(cur, ip)
                if left > 0:
                    minutes = (left + 59) // 60
                    return {
                        'statusCode': 429,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps(
                            {'ok': False, 'blocked': True, 'secondsLeft': left,
                             'error': f'Слишком много попыток. Попробуйте через {minutes} мин.'},
                            ensure_ascii=False
                        )
                    }
                cur.execute(
                    f"SELECT id FROM {CODES_TABLE} "
                    f"WHERE purpose = 'login' AND code = %s AND used = false "
                    f"AND expires_at > now() ORDER BY id DESC LIMIT 1",
                    (code,)
                )
                row = cur.fetchone()
                if not row:
                    block = _register_fail(cur, ip)
                    if block > 0:
                        return {
                            'statusCode': 429,
                            'headers': {**cors, 'Content-Type': 'application/json'},
                            'body': json.dumps(
                                {'ok': False, 'blocked': True, 'secondsLeft': block,
                                 'error': f'Слишком много попыток. Вход заблокирован на {BLOCK_MINUTES} мин.'},
                                ensure_ascii=False
                            )
                        }
                    return {
                        'statusCode': 401,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'ok': False, 'error': 'Неверный или просроченный код'}, ensure_ascii=False)
                    }
                cur.execute(f"UPDATE {CODES_TABLE} SET used = true WHERE id = %s", (row[0],))
                _reset_fails(cur, ip)
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'token': _make_token()}, ensure_ascii=False)
        }

    # --- Сброс пароля, шаг 1: отправить код на почту ---
    if mode == 'admin_reset_request':
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                code = _gen_code()
                cur.execute(
                    f"INSERT INTO {CODES_TABLE} (purpose, code, expires_at) "
                    f"VALUES ('reset', %s, now() + interval '10 minutes')",
                    (code,)
                )
        finally:
            conn.close()
        _send_code_email(os.environ['SMTP_PASSWORD'], code, 'reset')
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True}, ensure_ascii=False)
        }

    # --- Сброс пароля, шаг 2: проверить код и установить новый пароль ---
    if mode == 'admin_reset_confirm':
        code = str(body.get('code', '')).strip()
        new_password = body.get('newPassword', '')
        if len(new_password) < 6:
            return {
                'statusCode': 400,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Пароль минимум 6 символов'}, ensure_ascii=False)
            }
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"SELECT id FROM {CODES_TABLE} "
                    f"WHERE purpose = 'reset' AND code = %s AND used = false "
                    f"AND expires_at > now() ORDER BY id DESC LIMIT 1",
                    (code,)
                )
                row = cur.fetchone()
                if not row:
                    return {
                        'statusCode': 401,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps({'ok': False, 'error': 'Неверный или просроченный код'}, ensure_ascii=False)
                    }
                cur.execute(f"UPDATE {CODES_TABLE} SET used = true WHERE id = %s", (row[0],))
                cur.execute(
                    f"UPDATE {SETTINGS_TABLE} SET password_hash = %s, updated_at = now() WHERE id = 1",
                    (_hash_password(new_password),)
                )
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True}, ensure_ascii=False)
        }

    if mode == 'upload_image':
        token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
        if not _check_token(token):
            return {
                'statusCode': 401,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Требуется вход'}, ensure_ascii=False)
            }
        image_b64 = body.get('image', '')
        filename = str(body.get('filename', 'image.jpg'))
        if ',' in image_b64:
            image_b64 = image_b64.split(',', 1)[1]
        try:
            data = base64.b64decode(image_b64)
        except Exception:
            return {
                'statusCode': 400,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Некорректный файл'}, ensure_ascii=False)
            }
        if len(data) > 8 * 1024 * 1024:
            return {
                'statusCode': 400,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Файл больше 8 МБ'}, ensure_ascii=False)
            }
        ext = filename.rsplit('.', 1)[-1].lower() if '.' in filename else 'jpg'
        if ext not in ('jpg', 'jpeg', 'png', 'webp', 'gif'):
            ext = 'jpg'
        content_type = {
            'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
            'webp': 'image/webp', 'gif': 'image/gif',
        }[ext]
        key = f'blog/{uuid.uuid4().hex}.{ext}'
        s3 = boto3.client(
            's3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        )
        s3.put_object(Bucket='files', Key=key, Body=data, ContentType=content_type)
        url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'url': url}, ensure_ascii=False)
        }

    if mode == 'blog_list':
        token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
        if not _check_token(token):
            return {
                'statusCode': 401,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Требуется вход'}, ensure_ascii=False)
            }
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        try:
            with conn.cursor() as cur:
                posts = _get_posts(cur, only_published=False, full=True)
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'posts': posts}, ensure_ascii=False)
        }

    if mode == 'blog_save':
        token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
        if not _check_token(token):
            return {
                'statusCode': 401,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Требуется вход'}, ensure_ascii=False)
            }
        post = body.get('post', {})
        title = str(post.get('title', '')).strip()
        if not title:
            return {
                'statusCode': 400,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Заголовок обязателен'}, ensure_ascii=False)
            }
        post_id = post.get('id')
        excerpt = str(post.get('excerpt', ''))
        content_text = str(post.get('content', ''))
        cover = str(post.get('coverImage', ''))
        published = bool(post.get('published', True))
        slug = _slugify(str(post.get('slug', '') or title))

        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                # уникальность slug
                if post_id:
                    cur.execute(
                        f'SELECT id FROM {BLOG_TABLE} WHERE slug = %s AND id <> %s',
                        (slug, post_id)
                    )
                else:
                    cur.execute(f'SELECT id FROM {BLOG_TABLE} WHERE slug = %s', (slug,))
                if cur.fetchone():
                    slug = f'{slug}-{int(time.time())}'

                if post_id:
                    cur.execute(
                        f'UPDATE {BLOG_TABLE} SET slug=%s, title=%s, excerpt=%s, content=%s, '
                        f'cover_image=%s, published=%s, updated_at=now() WHERE id=%s',
                        (slug, title, excerpt, content_text, cover, published, post_id)
                    )
                else:
                    cur.execute(
                        f'INSERT INTO {BLOG_TABLE} (slug, title, excerpt, content, cover_image, published) '
                        f'VALUES (%s, %s, %s, %s, %s, %s)',
                        (slug, title, excerpt, content_text, cover, published)
                    )
                posts = _get_posts(cur, only_published=False, full=True)
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'posts': posts}, ensure_ascii=False)
        }

    if mode == 'blog_delete':
        token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
        if not _check_token(token):
            return {
                'statusCode': 401,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Требуется вход'}, ensure_ascii=False)
            }
        post_id = body.get('id')
        if not post_id:
            return {
                'statusCode': 400,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Не указан id'}, ensure_ascii=False)
            }
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                cur.execute(f'DELETE FROM {BLOG_TABLE} WHERE id = %s', (post_id,))
                posts = _get_posts(cur, only_published=False, full=True)
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'posts': posts}, ensure_ascii=False)
        }

    if mode == 'sections_save':
        token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
        if not _check_token(token):
            return {
                'statusCode': 401,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Требуется вход'}, ensure_ascii=False)
            }

        sections = body.get('sections', [])
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                for s in sections:
                    key = str(s.get('key', ''))
                    visible = bool(s.get('visible', True))
                    if not key:
                        continue
                    cur.execute(
                        f'UPDATE {SECTIONS_TABLE} SET visible = %s WHERE section_key = %s',
                        (visible, key)
                    )
                result = _get_sections(cur)
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'sections': result}, ensure_ascii=False)
        }

    if mode == 'content_save':
        token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
        if not _check_token(token):
            return {
                'statusCode': 401,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Требуется вход'}, ensure_ascii=False)
            }

        section_key = str(body.get('section', ''))
        content = body.get('content', {})
        if not section_key or not isinstance(content, dict):
            return {
                'statusCode': 400,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Некорректные данные'}, ensure_ascii=False)
            }
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f'INSERT INTO {CONTENT_TABLE} (section_key, content, updated_at) '
                    f'VALUES (%s, %s, now()) '
                    f'ON CONFLICT (section_key) DO UPDATE SET content = EXCLUDED.content, '
                    f'updated_at = now()',
                    (section_key, json.dumps(content, ensure_ascii=False))
                )
                result = _get_content(cur)
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'content': result}, ensure_ascii=False)
        }

    if mode == 'pricing_save':
        token = headers.get('X-Admin-Token') or headers.get('x-admin-token') or ''
        if not _check_token(token):
            return {
                'statusCode': 401,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'Требуется вход'}, ensure_ascii=False)
            }

        plans = body.get('plans', [])
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        try:
            with conn.cursor() as cur:
                cur.execute(f'DELETE FROM {PRICING_TABLE}')
                for i, p in enumerate(plans):
                    features = '|'.join(p.get('features', []))
                    cur.execute(
                        f'INSERT INTO {PRICING_TABLE} '
                        f'(sort_order, name, description, price, old_price, price_byn, '
                        f'old_price_byn, unit, gradient, features, popular, cta) '
                        f'VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)',
                        (
                            i + 1,
                            p.get('name', ''),
                            p.get('description', ''),
                            p.get('price', ''),
                            p.get('oldPrice', ''),
                            p.get('priceByn', ''),
                            p.get('oldPriceByn', ''),
                            p.get('unit', 'урок'),
                            p.get('gradient', 'gradient-card-blue'),
                            features,
                            bool(p.get('popular', False)),
                            p.get('cta', 'Выбрать'),
                        ),
                    )
                conn.commit()
                result = _get_plans(cur)
        finally:
            conn.close()
        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'plans': result}, ensure_ascii=False)
        }

    smtp_user = 'hispania35@yandex.ru'
    smtp_password = os.environ['SMTP_PASSWORD']

    if mode == 'promo':
        name = body.get('name', '')
        email = body.get('email', '').strip()

        if not re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email):
            return {
                'statusCode': 400,
                'headers': {**cors, 'Content-Type': 'application/json'},
                'body': json.dumps({'ok': False, 'error': 'invalid_email'}, ensure_ascii=False)
            }

        email_norm = email.lower()
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        conn.autocommit = True
        try:
            with conn.cursor() as cur:
                email_sql = email_norm.replace("'", "''")
                cur.execute(f"SELECT promo FROM {PROMO_TABLE} WHERE email = '{email_sql}'")
                existing = cur.fetchone()

                if existing:
                    return {
                        'statusCode': 200,
                        'headers': {**cors, 'Content-Type': 'application/json'},
                        'body': json.dumps(
                            {'ok': False, 'error': 'already_issued', 'promo': existing[0]},
                            ensure_ascii=False
                        )
                    }

                promo = _generate_promo()
                name_sql = name.replace("'", "''")
                promo_sql = promo.replace("'", "''")
                cur.execute(
                    f"INSERT INTO {PROMO_TABLE} (email, promo, name) "
                    f"VALUES ('{email_sql}', '{promo_sql}', '{name_sql}')"
                )
        finally:
            conn.close()

        # письмо клиенту с промокодом
        client_msg = MIMEMultipart()
        client_msg['From'] = smtp_user
        client_msg['To'] = email
        client_msg['Subject'] = 'Ваш промокод на скидку — Hispania'
        client_html = f"""
        <h2>Спасибо за подписку!</h2>
        <p>Привет{', ' + name if name else ''}! Спасибо, что подписались на нашу группу ВКонтакте.</p>
        <p>Ваш персональный промокод на скидку:</p>
        <p style="font-size:24px;font-weight:bold;letter-spacing:2px;color:#7c3aed;">{promo}</p>
        <p>Назовите его при записи на занятие, чтобы получить скидку. Промокод действует один раз.</p>
        <p>До встречи на занятиях!<br/>Языковая студия Hispania</p>
        """
        client_msg.attach(MIMEText(client_html, 'html'))

        # копия владельцу
        owner_msg = MIMEMultipart()
        owner_msg['From'] = smtp_user
        owner_msg['To'] = smtp_user
        owner_msg['Subject'] = f'Выдан промокод {promo} — {email}'
        owner_html = f"""
        <h2>Запрос промокода за подписку</h2>
        <table>
            <tr><td><b>Имя:</b></td><td>{name}</td></tr>
            <tr><td><b>Email:</b></td><td>{email}</td></tr>
            <tr><td><b>Промокод:</b></td><td>{promo}</td></tr>
        </table>
        """
        owner_msg.attach(MIMEText(owner_html, 'html'))

        with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(client_msg)
            server.send_message(owner_msg)

        return {
            'statusCode': 200,
            'headers': {**cors, 'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'promo': promo}, ensure_ascii=False)
        }

    name = body.get('name', '')
    contact = body.get('contact', '')
    question = body.get('question', '')

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = smtp_user
    msg['Subject'] = f'Новый вопрос с сайта — {name}'

    html = f"""
    <h2>Новый вопрос с сайта</h2>
    <table>
        <tr><td><b>Имя:</b></td><td>{name}</td></tr>
        <tr><td><b>Контакт:</b></td><td>{contact}</td></tr>
        <tr><td><b>Вопрос:</b></td><td>{question}</td></tr>
    </table>
    """
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/json'},
        'body': json.dumps({'ok': True})
    }