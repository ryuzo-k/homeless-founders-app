// Test script for country filtering functionality
console.log('=== Country Filtering Test ===');

// Mock house data (similar to what would be retrieved from database)
const mockHouses = [
    { name: 'Tokyo House', country: 'japan', region: 'tokyo' },
    { name: 'SF House', country: 'usa', region: 'sf' },
    { name: 'London House', country: 'uk', region: 'london' },
    { name: 'Singapore House', country: 'singapore', region: 'singapore' },
    { name: 'Toronto House', country: 'canada', region: 'other' },
    { name: 'Sydney House', country: 'australia', region: 'other' },
    { name: 'Berlin House', country: 'germany', region: 'other' },
    { name: 'Paris House', country: 'france', region: 'other' },
    { name: 'Amsterdam House', country: 'netherlands', region: 'other' },
    { name: 'Other House', country: 'other', region: 'other' },
    { name: 'Another House', country: 'japan', region: 'tokyo' }
];

console.log('Total houses in mock data:', mockHouses.length);

// Test filtering by different countries
const filterTests = [
    { filterValue: 'japan', expectedCount: 2 },
    { filterValue: 'usa', expectedCount: 1 },
    { filterValue: 'uk', expectedCount: 1 },
    { filterValue: 'singapore', expectedCount: 1 },
    { filterValue: 'canada', expectedCount: 1 },
    { filterValue: 'australia', expectedCount: 1 },
    { filterValue: 'germany', expectedCount: 1 },
    { filterValue: 'france', expectedCount: 1 },
    { filterValue: 'netherlands', expectedCount: 1 },
    { filterValue: 'other', expectedCount: 1 }, // Fixed: there's only 1 house with country "other"
    { filterValue: '', expectedCount: 11 } // No filter should show all houses
];

let allFilterTestsPassed = true;

filterTests.forEach((test, index) => {
    console.log(`\n--- Filter Test ${index + 1}: ${test.filterValue || 'all'} ---`);
    
    // Apply filter logic (same as in script.js)
    let filteredHouses = mockHouses;
    
    if (test.filterValue && test.filterValue !== '' && test.filterValue !== 'all') {
        filteredHouses = mockHouses.filter(house => {
            const houseCountry = house.country || 'other';
            return houseCountry === test.filterValue;
        });
    }
    
    const actualCount = filteredHouses.length;
    const testPassed = actualCount === test.expectedCount;
    
    console.log(`Filter value: "${test.filterValue || 'all'}"`);
    console.log(`Expected count: ${test.expectedCount} | Actual count: ${actualCount} | ${testPassed ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!testPassed) {
        allFilterTestsPassed = false;
    }
});

console.log('\n=== Filtering Test Summary ===');
console.log(`All filtering tests passed: ${allFilterTestsPassed ? '✅ YES' : '❌ NO'}`);

if (allFilterTestsPassed) {
    console.log('\n🎉 Country filtering functionality is working correctly!');
    console.log('The filter logic properly matches houses by their country field.');
} else {
    console.log('\n⚠️ Some filtering tests failed. There may be issues with the country filtering logic.');
}
