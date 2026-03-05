/*
  # Update License Key Type System

  Changes the user_mode system to support:
  - owner: Can create admin keys, manage all content
  - admin: Can create user/media keys, manage content
  - user: Regular user access
  - media: Media-only access

  Adds security tracking for auditing.
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'licenses' AND column_name = 'user_mode'
  ) THEN
    ALTER TABLE licenses DROP CONSTRAINT IF EXISTS licenses_user_mode_check;
  END IF;
END $$;

ALTER TABLE licenses
  ADD CONSTRAINT licenses_user_mode_check
  CHECK (user_mode IN ('owner', 'admin', 'user', 'media'));

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'licenses' AND column_name = 'last_used'
  ) THEN
    ALTER TABLE licenses ADD COLUMN last_used timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'licenses' AND column_name = 'ip_address'
  ) THEN
    ALTER TABLE licenses ADD COLUMN ip_address text;
  END IF;
END $$;