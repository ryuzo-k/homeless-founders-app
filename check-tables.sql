-- CHECK ALL TABLES EXIST
-- Run this to verify all required tables are created

-- Check if all tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('founders', 'hacker_houses', 'matches', 'parental_consents')
ORDER BY table_name;

-- Check table structures
\d founders
\d hacker_houses  
\d matches
\d parental_consents

-- Check data counts
SELECT 'founders' as table_name, COUNT(*) as count FROM founders
UNION ALL
SELECT 'hacker_houses', COUNT(*) FROM hacker_houses
UNION ALL  
SELECT 'matches', COUNT(*) FROM matches
UNION ALL
SELECT 'parental_consents', COUNT(*) FROM parental_consents;
