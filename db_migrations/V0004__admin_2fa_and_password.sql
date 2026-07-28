-- Настройки админа: храним хеш пароля, чтобы его можно было менять (сброс)
CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.admin_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    password_hash TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO t_p27960186_language_studio_land.admin_settings (id, password_hash)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

-- Одноразовые коды: для 2FA входа и для сброса пароля
CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.admin_codes (
    id SERIAL PRIMARY KEY,
    purpose TEXT NOT NULL,            -- 'login' или 'reset'
    code TEXT NOT NULL,              -- 8-значный код
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    used BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_codes_lookup
    ON t_p27960186_language_studio_land.admin_codes (purpose, code);