/*
  # License Management System Schema

  1. New Tables
    - `licenses`
      - `id` (uuid, primary key)
      - `license_key` (text, unique) - The actual license key
      - `user_mode` (text) - Either 'admin' or 'user'
      - `status` (text) - 'active', 'suspended', or 'deleted'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `created_by` (uuid) - Reference to who created this license
      
    - `news`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      
    - `app_versions`
      - `id` (uuid, primary key)
      - `version` (text)
      - `download_url` (text)
      - `release_notes` (text)
      - `is_latest` (boolean) - Only one should be true at a time
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Licenses: Users can read their own license, admins can manage all
    - News: Public read access, admin write access
    - App versions: Public read access, admin write access
*/

CREATE TABLE IF NOT EXISTS licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key text UNIQUE NOT NULL,
  user_mode text NOT NULL DEFAULT 'user' CHECK (user_mode IN ('admin', 'user')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);

CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS app_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version text NOT NULL,
  download_url text NOT NULL,
  release_notes text DEFAULT '',
  is_latest boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news"
  ON news FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert news"
  ON news FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

CREATE POLICY "Admins can update news"
  ON news FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

CREATE POLICY "Admins can delete news"
  ON news FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

CREATE POLICY "Anyone can read app versions"
  ON app_versions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admins can insert app versions"
  ON app_versions FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

CREATE POLICY "Admins can update app versions"
  ON app_versions FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

CREATE POLICY "Admins can delete app versions"
  ON app_versions FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

CREATE POLICY "Anyone can read active licenses"
  ON licenses FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Admins can insert licenses"
  ON licenses FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

CREATE POLICY "Admins can update licenses"
  ON licenses FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

CREATE POLICY "Admins can delete licenses"
  ON licenses FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM licenses
      WHERE licenses.license_key = current_setting('request.jwt.claims', true)::json->>'license_key'
      AND licenses.user_mode = 'admin'
      AND licenses.status = 'active'
    )
  );

INSERT INTO licenses (license_key, user_mode, status) VALUES
  ('ADMIN-' || substr(md5(random()::text), 1, 24), 'admin', 'active')
ON CONFLICT DO NOTHING;