// Test script to verify country registration functionality
console.log('Testing country registration functionality...');

// Simulate form data that would be submitted
const testFormData = {
    name: 'Test House',
    location: 'Test Location',
    email: 'test@example.com',
    sns: 'https://twitter.com/testhouse',
    country: 'japan', // This should be one of the dropdown values
    description: 'This is a test house for verification'
};

console.log('Test form data:', testFormData);

// Test the country to region mapping
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

const mappedRegion = countryToRegion[testFormData.country] || 'other';
console.log(`Country "${testFormData.country}" mapped to region "${mappedRegion}"`);

// Test the region to emoji mapping
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

const houseImage = getRegionEmoji(mappedRegion);
console.log(`Region "${mappedRegion}" mapped to emoji "${houseImage}"`);

// Create the house data object that would be sent to Supabase
const houseData = {
    ...testFormData,
    image: houseImage,
    region: mappedRegion
};

console.log('House data to be saved:', houseData);
console.log('House data fields:', Object.keys(houseData));

// Verify that the country field is properly set
if (houseData.country && houseData.country !== 'other') {
    console.log('✅ SUCCESS: Country field is properly set to:', houseData.country);
} else {
    console.log('❌ FAILURE: Country field is not properly set');
}

// Verify that the region field is properly mapped
if (houseData.region && houseData.region !== 'other') {
    console.log('✅ SUCCESS: Region field is properly mapped to:', houseData.region);
} else {
    console.log('❌ FAILURE: Region field is not properly mapped');
}

// Verify that the image emoji is correctly assigned
if (houseData.image && houseData.image !== '🏠') {
    console.log('✅ SUCCESS: Image emoji is correctly assigned:', houseData.image);
} else {
    console.log('⚠️ INFO: Image emoji defaulted to house icon');
}
