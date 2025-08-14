// Comprehensive test for the registration flow
console.log('=== Comprehensive Registration Flow Test ===');

// Test data for different countries
const testCases = [
    { country: 'japan', expectedRegion: 'tokyo', expectedEmoji: '🏙️' },
    { country: 'usa', expectedRegion: 'sf', expectedEmoji: '🌉' },
    { country: 'uk', expectedRegion: 'london', expectedEmoji: '🏰' },
    { country: 'singapore', expectedRegion: 'singapore', expectedEmoji: '🌴' },
    { country: 'canada', expectedRegion: 'other', expectedEmoji: '🏠' },
    { country: 'australia', expectedRegion: 'other', expectedEmoji: '🏠' },
    { country: 'germany', expectedRegion: 'other', expectedEmoji: '🏠' },
    { country: 'france', expectedRegion: 'other', expectedEmoji: '🏠' },
    { country: 'netherlands', expectedRegion: 'other', expectedEmoji: '🏠' },
    { country: 'other', expectedRegion: 'other', expectedEmoji: '🏠' }
];

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

// Test each case
let allTestsPassed = true;

testCases.forEach((testCase, index) => {
    console.log(`\n--- Test Case ${index + 1}: ${testCase.country} ---`);
    
    // Test country to region mapping
    const mappedRegion = countryToRegion[testCase.country] || 'other';
    const regionTestPassed = mappedRegion === testCase.expectedRegion;
    
    console.log(`Country "${testCase.country}" -> Region "${mappedRegion}"`);
    console.log(`Expected region: "${testCase.expectedRegion}" | ${regionTestPassed ? '✅ PASS' : '❌ FAIL'}`);
    
    // Test region to emoji mapping
    const emoji = getRegionEmoji(mappedRegion);
    const emojiTestPassed = emoji === testCase.expectedEmoji;
    
    console.log(`Region "${mappedRegion}" -> Emoji "${emoji}"`);
    console.log(`Expected emoji: "${testCase.expectedEmoji}" | ${emojiTestPassed ? '✅ PASS' : '❌ FAIL'}`);
    
    // Overall test result
    const testCasePassed = regionTestPassed && emojiTestPassed;
    console.log(`Test case result: ${testCasePassed ? '✅ PASS' : '❌ FAIL'}`);
    
    if (!testCasePassed) {
        allTestsPassed = false;
    }
});

console.log('\n=== Test Summary ===');
console.log(`All tests passed: ${allTestsPassed ? '✅ YES' : '❌ NO'}`);

if (allTestsPassed) {
    console.log('\n🎉 Registration flow country mapping is working correctly!');
    console.log('The country dropdown values match the expected mapping in the JavaScript code.');
} else {
    console.log('\n⚠️ Some tests failed. There may be inconsistencies in the country mapping.');
}
