CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.blog_posts (
    id SERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_image TEXT NOT NULL DEFAULT '',
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON t_p27960186_language_studio_land.blog_posts (slug);

INSERT INTO t_p27960186_language_studio_land.blog_posts (slug, title, excerpt, content, cover_image, published) VALUES
('kak-vyuchit-yazyk-s-nulya',
 'Как выучить иностранный язык с нуля',
 'Пошаговый разбор: с чего начать, как заниматься регулярно и не бросить через месяц.',
 E'Изучение языка с нуля кажется сложным, но при правильном подходе первые результаты появляются уже через несколько недель.\n\nГлавное — регулярность. Лучше заниматься по 20 минут каждый день, чем три часа раз в неделю.\n\nНачните с базовой лексики и простых фраз, которые понадобятся в реальных ситуациях. Постепенно подключайте аудирование и разговорную практику.\n\nНа наших занятиях мы выстраиваем программу под ваш уровень и цель — от путешествий до работы за рубежом.',
 '',
 true)
ON CONFLICT (slug) DO NOTHING;