CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.site_sections (
    section_key TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER NOT NULL DEFAULT 0
);

INSERT INTO t_p27960186_language_studio_land.site_sections (section_key, title, visible, sort_order) VALUES
    ('hero',      'Главный экран',        true, 1),
    ('about',     'Почему выбирают нас',  true, 2),
    ('languages', 'Языки',                true, 3),
    ('pricing',   'Цены и тарифы',        true, 4),
    ('teachers',  'Преподаватель',        true, 5),
    ('reviews',   'Отзывы',               true, 6),
    ('seo',       'SEO-блок',             true, 7),
    ('faq',       'Вопросы и ответы',     true, 8),
    ('booking',   'Запись на занятие',    true, 9),
    ('contacts',  'Контакты',             true, 10)
ON CONFLICT (section_key) DO NOTHING;