-- Защита от подбора кода: счётчик неудачных попыток и блокировка входа
CREATE TABLE IF NOT EXISTS t_p27960186_language_studio_land.admin_lockout (
    ip TEXT PRIMARY KEY,
    fails INTEGER NOT NULL DEFAULT 0,
    blocked_until TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);