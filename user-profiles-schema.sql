-- User Profiles Schema
-- Run this in your Supabase SQL editor to add user profiles

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('founder', 'host')),
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Update founders table to link to auth users
ALTER TABLE founders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update hacker_houses table to link to auth users  
ALTER TABLE hacker_houses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Create updated_at trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
