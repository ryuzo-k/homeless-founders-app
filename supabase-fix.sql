-- Fixed Supabase Setup
-- Run this in your Supabase SQL editor

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access on founders" ON founders;
DROP POLICY IF EXISTS "Allow public insert on founders" ON founders;
DROP POLICY IF EXISTS "Allow public read access on hacker_houses" ON hacker_houses;
DROP POLICY IF EXISTS "Allow public insert on hacker_houses" ON hacker_houses;
DROP POLICY IF EXISTS "Allow public read access on matches" ON matches;
DROP POLICY IF EXISTS "Allow public insert on matches" ON matches;
DROP POLICY IF EXISTS "Allow public read access on parental_consents" ON parental_consents;
DROP POLICY IF EXISTS "Allow public insert on parental_consents" ON parental_consents;
DROP POLICY IF EXISTS "Allow public update on parental_consents" ON parental_consents;

-- Enable Row Level Security (RLS)
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacker_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;

-- Create policies for PUBLIC ACCESS
CREATE POLICY "Allow public read access on founders" ON founders
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on founders" ON founders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on hacker_houses" ON hacker_houses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on hacker_houses" ON hacker_houses
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on matches" ON matches
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on matches" ON matches
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access on parental_consents" ON parental_consents
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on parental_consents" ON parental_consents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on parental_consents" ON parental_consents
    FOR UPDATE USING (true);

-- Insert sample data (fixed facilities format)
INSERT INTO hacker_houses (name, location, region, description, capacity, email, facilities) VALUES
('Tokyo Tech House', 'Tokyo, Japan', 'asia', 'AI/ML focused hacker house in Shibuya.', '8', 'hello@tokyotech.house', 'WiFi,Access,Mentorship,Events'),
('SF Startup Hub', 'San Francisco, CA', 'americas', 'YC-style accelerator in Silicon Valley.', '12', 'apply@sfhub.co', 'Network,Demos,Legal,Funding'),
('Berlin Builders', 'Berlin, Germany', 'europe', 'European startup community.', '6', 'team@berlinbuilders.com', 'Sustainability,Market,Space,Community')
ON CONFLICT DO NOTHING;

SELECT 'Setup completed!' as status;
