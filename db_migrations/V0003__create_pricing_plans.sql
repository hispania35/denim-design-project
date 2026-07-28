CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.pricing_plans (
    id SERIAL PRIMARY KEY,
    sort_order INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price TEXT NOT NULL DEFAULT '',
    old_price TEXT NOT NULL DEFAULT '',
    price_byn TEXT NOT NULL DEFAULT '',
    old_price_byn TEXT NOT NULL DEFAULT '',
    unit TEXT NOT NULL DEFAULT 'урок',
    gradient TEXT NOT NULL DEFAULT 'gradient-card-blue',
    features TEXT NOT NULL DEFAULT '',
    popular BOOLEAN NOT NULL DEFAULT false,
    cta TEXT NOT NULL DEFAULT 'Выбрать'
);

INSERT INTO t_p27960186_language_studio_land.pricing_plans
    (sort_order, name, description, price, old_price, price_byn, old_price_byn, unit, gradient, features, popular, cta)
VALUES
    (1, 'Старт', 'Для тех, кто только начинает', '1 200', '1 500', '45', '55', 'урок', 'gradient-card-blue', 'Индивидуальные занятия|40 минут продолжительность|Домашние задания|Чат с преподавателем', false, 'Начать'),
    (2, 'Стандарт', 'Оптимальный темп прогресса', '2 200', '', '80', '', 'урок', 'gradient-card-purple', 'Индивидуальные занятия|60 минут продолжительность|Домашние задания|Чат с преподавателем|Разговорный клуб', true, 'Выбрать'),
    (3, 'Групповой', 'От 3 человек — учиться веселее вместе', '800', '', '30', '', 'урок', 'gradient-card-orange', 'От 3 человек в группе|45 минут продолжительность|Домашние задания|Чат с преподавателем|Разговорный клуб', false, 'Выбрать');