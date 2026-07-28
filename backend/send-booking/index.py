import json
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправляет заявку с формы бронирования на почту hispania35@yandex.ru"""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }

    body = json.loads(event.get('body', '{}'))
    name = body.get('name', '')
    phone = body.get('phone', '')
    language = body.get('language', '')
    lesson_type = body.get('type', '')
    city = body.get('city', '')
    request_type = body.get('requestType', '')

    language_map = {
        'english': 'Английский',
        'german': 'Немецкий',
        'spanish': 'Испанский'
    }
    type_map = {
        'online': 'Онлайн',
        'offline': 'Офлайн'
    }

    language_ru = language_map.get(language, language)
    type_ru = type_map.get(lesson_type, lesson_type) if lesson_type else 'Не указан'
    city_ru = city if city else 'Главная страница'

    smtp_user = 'hispania35@yandex.ru'
    smtp_password = os.environ['SMTP_PASSWORD']

    is_callback = request_type == 'callback'

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = smtp_user
    if is_callback:
        msg['Subject'] = f'Заказ обратного звонка ({city_ru}) — {name}'
        html = f"""
        <h2>Заказ обратного звонка</h2>
        <table>
            <tr><td><b>Имя:</b></td><td>{name}</td></tr>
            <tr><td><b>Телефон:</b></td><td>{phone}</td></tr>
            <tr><td><b>Страница:</b></td><td>{city_ru}</td></tr>
        </table>
        <p>Клиент просит перезвонить.</p>
        """
    else:
        msg['Subject'] = f'Новая заявка с сайта ({city_ru}) — {name}'
        html = f"""
        <h2>Новая заявка с сайта</h2>
        <table>
            <tr><td><b>Имя:</b></td><td>{name}</td></tr>
            <tr><td><b>Телефон:</b></td><td>{phone}</td></tr>
            <tr><td><b>Язык:</b></td><td>{language_ru}</td></tr>
            <tr><td><b>Формат:</b></td><td>{type_ru}</td></tr>
            <tr><td><b>Город (страница):</b></td><td>{city_ru}</td></tr>
        </table>
        """
    msg.attach(MIMEText(html, 'html'))

    with smtplib.SMTP_SSL('smtp.yandex.ru', 465) as server:
        server.login(smtp_user, smtp_password)
        server.send_message(msg)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'ok': True})
    }