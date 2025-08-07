-- Complete Homeless Founders Database Setup
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

-- Create tables (if they don't exist)
CREATE TABLE IF NOT EXISTS parental_consents (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    minor_name text NOT NULL,
    minor_age int NOT NULL,
    minor_email text NOT NULL,
    parent_name text NOT NULL,
    parent_email text NOT NULL,
    parent_phone text,
    relationship text,
    emergency_name text,
    emergency_phone text,
    emergency_relationship text,
    signature_date date,
    consent_status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS founders (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 13 AND age <= 100),
    product TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    region VARCHAR(50) NOT NULL,
    parental_consent_id uuid REFERENCES parental_consents(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hacker_houses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    capacity VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    preferences TEXT,
    facilities TEXT DEFAULT '',
    image VARCHAR(10) DEFAULT '🏠',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    founder_id BIGINT REFERENCES founders(id),
    house_id BIGINT REFERENCES hacker_houses(id),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(founder_id, house_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_founders_region ON founders(region);
CREATE INDEX IF NOT EXISTS idx_founders_created_at ON founders(created_at);
CREATE INDEX IF NOT EXISTS idx_hacker_houses_region ON hacker_houses(region);
CREATE INDEX IF NOT EXISTS idx_hacker_houses_created_at ON hacker_houses(created_at);
CREATE INDEX IF NOT EXISTS idx_matches_founder_id ON matches(founder_id);
CREATE INDEX IF NOT EXISTS idx_matches_house_id ON matches(house_id);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);
CREATE INDEX IF NOT EXISTS idx_parental_consents_minor_email ON parental_consents(minor_email);

-- Enable Row Level Security (RLS)
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacker_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;

-- Create policies for PUBLIC ACCESS (for global users)
-- Founders table policies
CREATE POLICY "Allow public read access on founders" ON founders
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on founders" ON founders
    FOR INSERT WITH CHECK (true);

-- Hacker houses table policies
CREATE POLICY "Allow public read access on hacker_houses" ON hacker_houses
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on hacker_houses" ON hacker_houses
    FOR INSERT WITH CHECK (true);

-- Matches table policies
CREATE POLICY "Allow public read access on matches" ON matches
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on matches" ON matches
    FOR INSERT WITH CHECK (true);

-- Parental consents table policies
CREATE POLICY "Allow public read access on parental_consents" ON parental_consents
    FOR SELECT USING (true);

CREATE POLICY "Allow public insert on parental_consents" ON parental_consents
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update on parental_consents" ON parental_consents
    FOR UPDATE USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_founders_updated_at ON founders;
CREATE TRIGGER update_founders_updated_at
    BEFORE UPDATE ON founders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_hacker_houses_updated_at ON hacker_houses;
CREATE TRIGGER update_hacker_houses_updated_at
    BEFORE UPDATE ON hacker_houses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at
    BEFORE UPDATE ON matches
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO hacker_houses (name, location, region, description, capacity, email, facilities) VALUES
('Tokyo Tech House', 'Tokyo, Japan', 'asia', 'AI/ML focused hacker house in Shibuya. Perfect for tech founders building innovative products.', '8', 'hello@tokyotech.house', 'High-speed WiFi, 24/7 Access, Mentorship, Networking Events'),
('SF Startup Hub', 'San Francisco, CA', 'americas', 'YC-style accelerator environment in the heart of Silicon Valley. Connect with investors and fellow founders.', '12', 'apply@sfhub.co', 'Investor Network, Demo Days, Legal Support, Funding Prep'),
('Berlin Builders', 'Berlin, Germany', 'europe', 'European startup community focused on sustainable tech and social impact ventures.', '6', 'team@berlinbuilders.com', 'Sustainability Focus, EU Market Access, Co-working Space, Community Events')
ON CONFLICT DO NOTHING;

-- Verify setup
SELECT 'Setup completed successfully!' as status;
SELECT 'Hacker houses count: ' || COUNT(*) as houses_count FROM hacker_houses;
