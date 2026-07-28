CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.promo_codes (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    promo VARCHAR(32) NOT NULL,
    name VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promo_codes_email ON t_p27960186_language_studio_land.promo_codes (email);