CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.section_content (
    section_key TEXT PRIMARY KEY,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO t_p27960186_language_studio_land.section_content (section_key, content) VALUES
('hero', '{
  "badge": "Набор на 2026 год открыт",
  "titleStart": "Говори на",
  "titleAccent": "языке",
  "titleEnd": "своей мечты",
  "description": "Английский, немецкий и испанский с нуля до свободного общения. Современные методики и живая практика с первого занятия.",
  "primaryBtn": "Записаться на пробное",
  "secondaryBtn": "Узнать больше",
  "stat1Value": "500+",
  "stat1Label": "учеников",
  "stat2Value": "15 лет",
  "stat2Label": "опыта",
  "image": "https://cdn.poehali.dev/projects/c066c37a-f840-40ae-bf25-35290452380d/files/803028f6-6301-487d-bdfa-c9513189e123.jpg"
}'::jsonb),
('teachers', '{
  "badge": "Ваш наставник",
  "name": "Седова Ольга",
  "description": "Сертифицированный преподаватель с международным опытом",
  "image": "https://cdn.poehali.dev/projects/c066c37a-f840-40ae-bf25-35290452380d/bucket/35f364a9-ef21-4a45-9003-9875215dd2ca.jpg"
}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;