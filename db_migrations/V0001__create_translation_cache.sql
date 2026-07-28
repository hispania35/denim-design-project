CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.translation_cache (
    id SERIAL PRIMARY KEY,
    text_key VARCHAR(64) NOT NULL,
    lang_code VARCHAR(8) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(text_key, lang_code)
);