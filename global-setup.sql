-- COMPLETE GLOBAL SETUP FOR HOMELESS FOUNDERS
-- Run this ENTIRE script in Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access on founders" ON founders;
DROP POLICY IF EXISTS "Allow public insert on founders" ON founders;
DROP POLICY IF EXISTS "Allow public read access on hacker_houses" ON hacker_houses;
DROP POLICY IF EXISTS "Allow public insert on hacker_houses" ON hacker_houses;
DROP POLICY IF EXISTS "Allow public read access on matches" ON matches;
DROP POLICY IF EXISTS "Allow public insert on matches" ON matches;
DROP POLICY IF EXISTS "Allow public read access on parental_consents" ON parental_consents;
DROP POLICY IF EXISTS "Allow public insert on parental_consents" ON parental_consents;
DROP POLICY IF EXISTS "Allow public update on parental_consents" ON parental_consents;

-- Enable RLS on all tables
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacker_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;

-- FOUNDERS TABLE POLICIES
CREATE POLICY "Global founders read" ON founders FOR SELECT USING (true);
CREATE POLICY "Global founders insert" ON founders FOR INSERT WITH CHECK (true);

-- HACKER HOUSES TABLE POLICIES  
CREATE POLICY "Global houses read" ON hacker_houses FOR SELECT USING (true);
CREATE POLICY "Global houses insert" ON hacker_houses FOR INSERT WITH CHECK (true);

-- MATCHES TABLE POLICIES
CREATE POLICY "Global matches read" ON matches FOR SELECT USING (true);
CREATE POLICY "Global matches insert" ON matches FOR INSERT WITH CHECK (true);

-- PARENTAL CONSENTS TABLE POLICIES
CREATE POLICY "Global consents read" ON parental_consents FOR SELECT USING (true);
CREATE POLICY "Global consents insert" ON parental_consents FOR INSERT WITH CHECK (true);
CREATE POLICY "Global consents update" ON parental_consents FOR UPDATE USING (true);

-- Clear existing sample data
DELETE FROM hacker_houses WHERE email IN ('hello@tokyotech.house', 'apply@sfhub.co', 'team@berlinbuilders.com');

-- Insert global sample data
INSERT INTO hacker_houses (name, location, region, description, capacity, email, facilities) VALUES
('Tokyo Tech House', 'Tokyo, Japan', 'asia', 'AI/ML focused hacker house in Shibuya', '8', 'hello@tokyotech.house', 'WiFi,Access,Mentorship,Events'),
('SF Startup Hub', 'San Francisco, CA', 'americas', 'YC-style accelerator in Silicon Valley', '12', 'apply@sfhub.co', 'Network,Demos,Legal,Funding'),
('Berlin Builders', 'Berlin, Germany', 'europe', 'European startup community', '6', 'team@berlinbuilders.com', 'Sustainability,Market,Space,Community'),
('London Tech Hub', 'London, UK', 'europe', 'Fintech and AI startup community', '10', 'hello@londontech.co.uk', 'Banking,AI,Networking,Mentorship'),
('Singapore Innovation', 'Singapore', 'asia', 'Southeast Asian startup hub', '15', 'info@sg-innovation.com', 'Government,Funding,International,Growth'),
('NYC Founders House', 'New York, NY', 'americas', 'Manhattan-based founder community', '8', 'apply@nycfounders.house', 'Finance,Media,Networking,Events'),
('Toronto Builders', 'Toronto, Canada', 'americas', 'Canadian tech startup community', '12', 'hello@torontobuilders.ca', 'Healthcare,Fintech,Government,Support'),
('Sydney Startup Hub', 'Sydney, Australia', 'oceania', 'Australian innovation center', '10', 'contact@sydneystartup.com.au', 'Innovation,Government,International,Community');

-- Verify setup
SELECT 'GLOBAL SETUP COMPLETE!' as status;
SELECT COUNT(*) as total_houses FROM hacker_houses;
SELECT name, location, region FROM hacker_houses ORDER BY region, name;
