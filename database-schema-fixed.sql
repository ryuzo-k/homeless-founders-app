-- Homeless Founders Database Schema (Fixed)
-- Run this in your Supabase SQL editor

-- Create founders table
CREATE TABLE IF NOT EXISTS founders (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 16 AND age <= 100),
    product TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    region VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hacker_houses table
CREATE TABLE IF NOT EXISTS hacker_houses (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    region VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    capacity VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    preferences TEXT,
    facilities JSONB DEFAULT '[]'::jsonb,
    image VARCHAR(10) DEFAULT '🏠',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id BIGSERIAL PRIMARY KEY,
    founder_id BIGINT REFERENCES founders(id) ON DELETE CASCADE,
    house_id BIGINT REFERENCES hacker_houses(id) ON DELETE CASCADE,
    match_score DECIMAL(5,2) NOT NULL CHECK (match_score >= 0 AND match_score <= 100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
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

-- Enable Row Level Security (RLS)
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacker_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for production)
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

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_founders_updated_at BEFORE UPDATE ON founders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hacker_houses_updated_at BEFORE UPDATE ON hacker_houses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO hacker_houses (name, location, region, description, capacity, email, facilities, image) VALUES
('Tokyo Innovation Hub', 'Shibuya, Tokyo', 'tokyo', 'A vibrant hacker house in the heart of Tokyo, perfect for AI and web3 startups.', '6-10', 'contact@tokyohub.com', '["wifi", "workspace", "kitchen", "meeting"]', '🏙️'),
('SF Tech House', 'Mission District, San Francisco', 'sf', 'Located in the startup capital of the world, ideal for scaling your tech company.', '3-5', 'hello@sftechhouse.com', '["wifi", "workspace", "24h", "mentoring"]', '🌉'),
('London Startup Collective', 'Shoreditch, London', 'london', 'A creative space for European expansion and fintech innovations.', '10+', 'info@londonstartup.co.uk', '["wifi", "workspace", "kitchen", "meeting", "mentoring"]', '🏛️');

-- Create a view for statistics
CREATE OR REPLACE VIEW platform_stats AS
SELECT 
    (SELECT COUNT(*) FROM founders) as total_founders,
    (SELECT COUNT(*) FROM hacker_houses) as total_houses,
    (SELECT COUNT(DISTINCT region) FROM hacker_houses) as active_regions,
    (SELECT COUNT(*) FROM matches WHERE status = 'accepted') as successful_matches;
