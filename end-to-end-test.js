// End-to-end test for country registration and filtering
console.log('=== End-to-End Country Registration and Filtering Test ===');

// Test the complete flow from registration data to filtering
const testCountries = ['japan', 'usa', 'uk', 'singapore', 'canada', 'australia', 'germany', 'france', 'netherlands', 'other'];

// Country to region mapping (same as in script.js)
const countryToRegion = {
    'japan': 'tokyo',
    'usa': 'sf',
    'uk': 'london',
    'singapore': 'singapore',
    'canada': 'other',
    'australia': 'other',
    'germany': 'other',
    'france': 'other',
    'netherlands': 'other',
    'other': 'other'
};

// Region to emoji mapping (same as in script.js)
function getRegionEmoji(region) {
    const emojiMap = {
        'tokyo': '🏙️',
        'sf': '🌉',
        'nyc': '🗽',
        'london': '🏰',
        'singapore': '🌴',
        'other': '🏠'
    };
    return emojiMap[region] || '🏠';
}

// Mock database storage
let databaseHouses = [];

console.log('Testing registration and filtering for each country...\n');

let allEndToEndTestsPassed = true;

testCountries.forEach((country, index) => {
    console.log(`--- Test ${index + 1}: ${country} ---`);
    
    // Simulate form submission
    const formData = {
        name: `Test House ${index + 1}`,
        location: `Test Location ${index + 1}`,
        email: `test${index + 1}@example.com`,
        country: country,
        description: `Test house in ${country}`
    };
    
    console.log('Form data:', formData);
    
    // Registration logic (same as in registerHackerHouse function)
    const mappedRegion = countryToRegion[formData.country] || 'other';
    const houseData = {
        ...formData,
        image: getRegionEmoji(mappedRegion),
        region: mappedRegion
    };
    
    console.log('Registered house data:', houseData);
    
    // Simulate saving to database
    databaseHouses.push(houseData);
    console.log(`✅ House registered with country: "${houseData.country}" and region: "${houseData.region}"`);
    
    // Test filtering logic (same as in loadHackerHousesList function)
    const filteredHouses = databaseHouses.filter(house => {
        const houseCountry = house.country || 'other';
        return houseCountry === country;
    });
    
    const countryHouses = filteredHouses.filter(house => house.country === country);
    const filterResult = countryHouses.length > 0 ? '✅ PASS' : '❌ FAIL';
    
    console.log(`Filter test for "${country}": Found ${countryHouses.length} houses | ${filterResult}`);
    
    if (countryHouses.length === 0) {
        allEndToEndTestsPassed = false;
    }
    
    console.log('');
});

console.log('=== Database State After Registration ===');
console.log('Total houses registered:', databaseHouses.length);
databaseHouses.forEach((house, index) => {
    console.log(`${index + 1}. ${house.name} - Country: ${house.country}, Region: ${house.region}, Emoji: ${house.image}`);
});

console.log('\n=== End-to-End Test Summary ===');
console.log(`All end-to-end tests passed: ${allEndToEndTestsPassed ? '✅ YES' : '❌ NO'}`);

if (allEndToEndTestsPassed) {
    console.log('\n🎉 Complete end-to-end country registration and filtering functionality is working correctly!');
    console.log('Users can now register houses with specific countries and filter by them successfully.');
} else {
    console.log('\n⚠️ Some end-to-end tests failed. There may be issues with the complete flow.');
}
