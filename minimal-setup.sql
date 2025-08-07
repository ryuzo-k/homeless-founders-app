-- MINIMAL WORKING SETUP
-- Copy and paste this entire script

-- Enable RLS
ALTER TABLE hacker_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;

-- Drop old policies
DROP POLICY IF EXISTS "Global houses read" ON hacker_houses;
DROP POLICY IF EXISTS "Global houses insert" ON hacker_houses;
DROP POLICY IF EXISTS "Global founders read" ON founders;
DROP POLICY IF EXISTS "Global founders insert" ON founders;
DROP POLICY IF EXISTS "Global consents read" ON parental_consents;
DROP POLICY IF EXISTS "Global consents insert" ON parental_consents;
DROP POLICY IF EXISTS "Global consents update" ON parental_consents;

-- Create policies
CREATE POLICY "Global houses read" ON hacker_houses FOR SELECT USING (true);
CREATE POLICY "Global houses insert" ON hacker_houses FOR INSERT WITH CHECK (true);
CREATE POLICY "Global founders read" ON founders FOR SELECT USING (true);
CREATE POLICY "Global founders insert" ON founders FOR INSERT WITH CHECK (true);
CREATE POLICY "Global consents read" ON parental_consents FOR SELECT USING (true);
CREATE POLICY "Global consents insert" ON parental_consents FOR INSERT WITH CHECK (true);
CREATE POLICY "Global consents update" ON parental_consents FOR UPDATE USING (true);

-- Clear and add simple sample data
DELETE FROM hacker_houses;
INSERT INTO hacker_houses (name, location, region, description, capacity, email, facilities) VALUES
('Tokyo Tech House', 'Tokyo, Japan', 'asia', 'AI/ML hacker house', '8', 'hello@tokyotech.house', 'WiFi'),
('SF Startup Hub', 'San Francisco, CA', 'americas', 'Silicon Valley accelerator', '12', 'apply@sfhub.co', 'Network'),
('Berlin Builders', 'Berlin, Germany', 'europe', 'European startup community', '6', 'team@berlinbuilders.com', 'Community');

SELECT 'Setup complete!' as status, COUNT(*) as houses FROM hacker_houses;
