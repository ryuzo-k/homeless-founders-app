-- Simple Supabase Fix
-- Copy and paste this into SQL Editor

-- Enable RLS and create policies
ALTER TABLE hacker_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access on hacker_houses" ON hacker_houses;
DROP POLICY IF EXISTS "Allow public insert on hacker_houses" ON hacker_houses;

-- Create new policies
CREATE POLICY "Allow public read access on hacker_houses" ON hacker_houses FOR SELECT USING (true);
CREATE POLICY "Allow public insert on hacker_houses" ON hacker_houses FOR INSERT WITH CHECK (true);

-- Add sample data with simple facilities
INSERT INTO hacker_houses (name, location, region, description, capacity, email, facilities) VALUES
('Tokyo Tech House', 'Tokyo, Japan', 'asia', 'AI/ML focused hacker house', '8', 'hello@tokyotech.house', 'WiFi,Mentorship'),
('SF Startup Hub', 'San Francisco, CA', 'americas', 'Silicon Valley accelerator', '12', 'apply@sfhub.co', 'Network,Funding'),
('Berlin Builders', 'Berlin, Germany', 'europe', 'European startup community', '6', 'team@berlinbuilders.com', 'Sustainability,Community')
ON CONFLICT DO NOTHING;
