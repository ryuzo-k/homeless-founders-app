-- Add photo columns to hacker_houses table
-- Run this in your Supabase SQL editor

ALTER TABLE hacker_houses 
ADD COLUMN IF NOT EXISTS photos TEXT[]; -- Array of photo URLs

-- Add comment for clarity
COMMENT ON COLUMN hacker_houses.photos IS 'Array of photo URLs uploaded for the house';

-- Update existing records to have empty photo arrays
UPDATE hacker_houses SET photos = '{}' WHERE photos IS NULL;
