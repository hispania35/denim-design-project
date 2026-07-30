import json
import os
from datetime import datetime, timezone
from typing import Dict, Any
import psycopg2

BLOG_TABLE = 't_p27960186_language_studio_land.blog_posts'
SITE_URL = 'https://hispania35.ru'

STATIC_URLS = [
    ('/', '1.0', 'weekly'),
    ('/blog', '0.8', 'weekly'),
    ('/privacy', '0.3', 'yearly'),
    ('/oferta', '0.3', 'yearly'),
]


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    '''Генерирует sitemap.xml на лету: статичные страницы + опубликованные статьи блога из БД'''
    cors = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    }

    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors, 'body': ''}

    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    urls = []
    for path, priority, changefreq in STATIC_URLS:
        urls.append({'loc': f'{SITE_URL}{path}', 'lastmod': today, 'changefreq': changefreq, 'priority': priority})

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        cur = conn.cursor()
        cur.execute(f"SELECT slug, updated_at FROM {BLOG_TABLE} WHERE published = true ORDER BY created_at DESC")
        rows = cur.fetchall()
        for slug, updated_at in rows:
            lastmod = updated_at.strftime('%Y-%m-%d') if updated_at else today
            urls.append({'loc': f'{SITE_URL}/blog/{slug}', 'lastmod': lastmod, 'changefreq': 'monthly', 'priority': '0.6'})
        cur.close()
    finally:
        conn.close()

    xml_items = []
    for u in urls:
        xml_items.append(
            f"  <url>\n"
            f"    <loc>{u['loc']}</loc>\n"
            f"    <lastmod>{u['lastmod']}</lastmod>\n"
            f"    <changefreq>{u['changefreq']}</changefreq>\n"
            f"    <priority>{u['priority']}</priority>\n"
            f"  </url>"
        )

    body = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
        '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        + "\n".join(xml_items) +
        '\n</urlset>\n'
    )

    return {
        'statusCode': 200,
        'headers': {**cors, 'Content-Type': 'application/xml; charset=UTF-8'},
        'body': body
    }