CREATE TABLE site_data (
    id SERIAL PRIMARY KEY,
    site_id TEXT,
    site_name TEXT,
    mc_cluster TEXT,
    province TEXT,
    dati_ii TEXT,
    scope_category TEXT,
    scope_of_work TEXT,
    ran_scope TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    nano_cluster TEXT,
    survey_ff TIMESTAMP,
    survey_bf TIMESTAMP,
    survey_af TIMESTAMP,
    mos_ff TIMESTAMP,
    mos_bf TIMESTAMP,
    mos_af TIMESTAMP,
    cutover_ff TIMESTAMP,
    cutover_bf TIMESTAMP,
    cutover_af TIMESTAMP,
    site_dismantle_ff TIMESTAMP,
    site_dismantle_bf TIMESTAMP,
    site_dismantle_af TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_site_id ON site_data(site_id);
CREATE INDEX idx_mc_cluster ON site_data(mc_cluster);
CREATE INDEX idx_province ON site_data(province);
CREATE INDEX idx_dati_ii ON site_data(dati_ii); 