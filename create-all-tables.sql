-- CREATE ALL REQUIRED TABLES
-- Run this if any tables are missing

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create founders table
CREATE TABLE IF NOT EXISTS founders (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    age int NOT NULL,
    email text NOT NULL,
    phone text,
    location text,
    skills text,
    experience text,
    motivation text,
    duration int,
    start_date date,
    parent_email text,
    created_at timestamp with time zone DEFAULT now()
);

-- Create hacker_houses table  
CREATE TABLE IF NOT EXISTS hacker_houses (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    name text NOT NULL,
    location text NOT NULL,
    region text NOT NULL,
    description text,
    capacity int,
    email text NOT NULL,
    facilities json,
    created_at timestamp with time zone DEFAULT now()
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    founder_id uuid REFERENCES founders(id),
    house_id uuid REFERENCES hacker_houses(id),
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now()
);

-- Create parental_consents table
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
    digital_signature text NOT NULL,
    status text DEFAULT 'pending',
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hacker_houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE parental_consents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read founders" ON founders FOR SELECT USING (true);
CREATE POLICY "Public insert founders" ON founders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read houses" ON hacker_houses FOR SELECT USING (true);
CREATE POLICY "Public insert houses" ON hacker_houses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public insert matches" ON matches FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read consents" ON parental_consents FOR SELECT USING (true);
CREATE POLICY "Public insert consents" ON parental_consents FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update consents" ON parental_consents FOR UPDATE USING (true);

SELECT 'ALL TABLES CREATED!' as status;
