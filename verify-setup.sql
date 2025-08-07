-- VERIFY GLOBAL SETUP
-- Run this to check if everything is working

-- Check RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('founders', 'hacker_houses', 'matches', 'parental_consents');

-- Check policies exist
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('founders', 'hacker_houses', 'matches', 'parental_consents')
ORDER BY tablename, policyname;

-- Check sample data
SELECT 'Hacker Houses:' as check_type, COUNT(*) as count FROM hacker_houses
UNION ALL
SELECT 'Founders:', COUNT(*) FROM founders
UNION ALL
SELECT 'Matches:', COUNT(*) FROM matches
UNION ALL
SELECT 'Parental Consents:', COUNT(*) FROM parental_consents;

-- Test data by region
SELECT region, COUNT(*) as houses_count 
FROM hacker_houses 
GROUP BY region 
ORDER BY region;

-- Show all houses
SELECT name, location, region, email 
FROM hacker_houses 
ORDER BY region, name;
