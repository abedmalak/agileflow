-- Add structured profile columns (migrating from JSONB settings)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS skills TEXT[];

-- Migrate existing data from settings JSONB to new columns
UPDATE profiles
SET job_title = settings->>'job_title',
    department = settings->>'department'
WHERE settings->>'job_title' IS NOT NULL
   OR settings->>'department' IS NOT NULL;
