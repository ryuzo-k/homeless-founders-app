-- Add country column to hacker_houses table
ALTER TABLE hacker_houses ADD COLUMN IF NOT EXISTS country VARCHAR(50);
