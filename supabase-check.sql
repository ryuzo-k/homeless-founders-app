-- SUPABASE-COMPATIBLE TABLE CHECK
-- Copy and paste this into Supabase SQL Editor

-- Check if all tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('founders', 'hacker_houses', 'matches', 'parental_consents')
ORDER BY table_name;

-- Check data counts
SELECT 'founders' as table_name, COUNT(*) as count FROM founders
UNION ALL
SELECT 'hacker_houses', COUNT(*) FROM hacker_houses
UNION ALL  
SELECT 'matches', COUNT(*) FROM matches
UNION ALL
SELECT 'parental_consents', COUNT(*) FROM parental_consents;

-- Check hacker_houses data specifically
SELECT name, location, region, email FROM hacker_houses ORDER BY created_at DESC LIMIT 10;
