-- JSON-COMPATIBLE SETUP
-- Copy and paste this ENTIRE script

-- Enable RLS
ALTER TABLE hacker_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Global houses read" ON hacker_houses;
DROP POLICY IF EXISTS "Global houses insert" ON hacker_houses;
DROP POLICY IF EXISTS "Global founders read" ON founders;
DROP POLICY IF EXISTS "Global founders insert" ON founders;
DROP POLICY IF EXISTS "Global consents read" ON parental_consents;
DROP POLICY IF EXISTS "Global consents insert" ON parental_consents;
DROP POLICY IF EXISTS "Global consents update" ON parental_consents;

-- Create working policies
CREATE POLICY "Global houses read" ON hacker_houses FOR SELECT USING (true);
CREATE POLICY "Global houses insert" ON hacker_houses FOR INSERT WITH CHECK (true);
CREATE POLICY "Global founders read" ON founders FOR SELECT USING (true);
CREATE POLICY "Global founders insert" ON founders FOR INSERT WITH CHECK (true);
CREATE POLICY "Global consents read" ON parental_consents FOR SELECT USING (true);
CREATE POLICY "Global consents insert" ON parental_consents FOR INSERT WITH CHECK (true);
CREATE POLICY "Global consents update" ON parental_consents FOR UPDATE USING (true);

-- Clear existing data
DELETE FROM hacker_houses;

-- Add working sample data (facilities as JSON array)
INSERT INTO hacker_houses (name, location, region, description, capacity, email, facilities) VALUES
('Tokyo Tech House', 'Tokyo, Japan', 'asia', 'AI/ML hacker house', 8, 'hello@tokyotech.house', '["WiFi", "Mentorship", "Events"]'),
('SF Startup Hub', 'San Francisco, CA', 'americas', 'Silicon Valley accelerator', 12, 'apply@sfhub.co', '["Network", "Funding", "Legal"]'),
('Berlin Builders', 'Berlin, Germany', 'europe', 'European startup community', 6, 'team@berlinbuilders.com', '["Community", "Sustainability"]'),
('London Tech Hub', 'London, UK', 'europe', 'Fintech startup community', 10, 'hello@londontech.co.uk', '["Banking", "AI", "Networking"]'),
('Singapore Innovation', 'Singapore', 'asia', 'Southeast Asian startup hub', 15, 'info@sg-innovation.com', '["Government", "International"]'),
('NYC Founders House', 'New York, NY', 'americas', 'Manhattan founder community', 8, 'apply@nycfounders.house', '["Finance", "Media", "Events"]'),
('Toronto Builders', 'Toronto, Canada', 'americas', 'Canadian tech community', 12, 'hello@torontobuilders.ca', '["Healthcare", "Government"]'),
('Sydney Startup Hub', 'Sydney, Australia', 'oceania', 'Australian innovation center', 10, 'contact@sydneystartup.com.au', '["Innovation", "Community"]');

-- Verify setup
SELECT 'GLOBAL SETUP COMPLETE!' as status;
SELECT COUNT(*) as total_houses FROM hacker_houses;
SELECT name, location, region FROM hacker_houses ORDER BY region, name;
