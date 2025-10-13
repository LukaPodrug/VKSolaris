import bcrypt from 'bcrypt';

export async function ensureSchema(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      member_id TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending', -- pending | active | suspended
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS promo_codes (
      id SERIAL PRIMARY KEY,
      code TEXT UNIQUE NOT NULL,
      discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
      is_active BOOLEAN NOT NULL DEFAULT true,
      expires_at TIMESTAMPTZ,
      usage_limit INTEGER,
      usage_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS user_promotions (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      promo_code_id INTEGER REFERENCES promo_codes(id),
      discount_percent INTEGER NOT NULL CHECK (discount_percent >= 0 AND discount_percent <= 100),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS wallet_cards (
      id SERIAL PRIMARY KEY,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      member_id TEXT NOT NULL,
      design_json JSONB,
      status TEXT NOT NULL DEFAULT 'active', -- active | revoked | expired
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS users_updated_at ON users;
    CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

    DROP TRIGGER IF EXISTS promo_codes_updated_at ON promo_codes;
    CREATE TRIGGER promo_codes_updated_at BEFORE UPDATE ON promo_codes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

    DROP TRIGGER IF EXISTS user_promotions_updated_at ON user_promotions;
    CREATE TRIGGER user_promotions_updated_at BEFORE UPDATE ON user_promotions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

    DROP TRIGGER IF EXISTS wallet_cards_updated_at ON wallet_cards;
    CREATE TRIGGER wallet_cards_updated_at BEFORE UPDATE ON wallet_cards
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  `);

  // Ensure member_id auto-populates from id when not provided
  await pool.query(`
    CREATE OR REPLACE FUNCTION ensure_member_id()
    RETURNS TRIGGER AS $$
    BEGIN
      IF NEW.member_id IS NULL THEN
        NEW.member_id := NEW.id::text;
      END IF;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    DROP TRIGGER IF EXISTS users_member_id ON users;
    CREATE TRIGGER users_member_id BEFORE INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION ensure_member_id();
  `);

  // Backfill missing member_id values
  await pool.query('UPDATE users SET member_id = id::text WHERE member_id IS NULL');

  // Ensure at least one admin exists, using env defaults if provided
  const defaultEmail = process.env.ADMIN_DEFAULT_EMAIL;
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD;
  if (defaultEmail && defaultPassword) {
    const { rows } = await pool.query('SELECT id FROM admins WHERE email=$1', [defaultEmail]);
    if (!rows.length) {
      const hash = await bcrypt.hash(defaultPassword, 10);
      await pool.query('INSERT INTO admins (email, password_hash) VALUES ($1,$2)', [defaultEmail, hash]);
    }
  }
}


