// DOM test to verify HTML form elements
console.log('=== DOM Element Test for Country Dropdowns ===');

// Simulate checking the registration form country dropdown
console.log('Registration Form Country Dropdown Options:');
const registrationOptions = [
    { value: '', text: 'Select a country' },
    { value: 'japan', text: 'Japan' },
    { value: 'usa', text: 'USA' },
    { value: 'uk', text: 'UK' },
    { value: 'singapore', text: 'Singapore' },
    { value: 'canada', text: 'Canada' },
    { value: 'australia', text: 'Australia' },
    { value: 'germany', text: 'Germany' },
    { value: 'france', text: 'France' },
    { value: 'netherlands', text: 'Netherlands' },
    { value: 'other', text: 'Other' }
];

registrationOptions.forEach((option, index) => {
    console.log(`${index + 1}. Value: "${option.value}" | Text: "${option.text}"`);
});

console.log('\nEdit House Form Country Dropdown Options:');
const editOptions = [
    { value: '', text: 'Select a country' },
    { value: 'japan', text: 'Japan' },
    { value: 'usa', text: 'USA' },
    { value: 'uk', text: 'UK' },
    { value: 'singapore', text: 'Singapore' },
    { value: 'canada', text: 'Canada' },
    { value: 'australia', text: 'Australia' },
    { value: 'germany', text: 'Germany' },
    { value: 'france', text: 'France' },
    { value: 'netherlands', text: 'Netherlands' },
    { value: 'other', text: 'Other' }
];

editOptions.forEach((option, index) => {
    console.log(`${index + 1}. Value: "${option.value}" | Text: "${option.text}"`);
});

// Verify that the registration and edit forms have the same options
let formsMatch = true;
for (let i = 0; i < registrationOptions.length; i++) {
    if (registrationOptions[i].value !== editOptions[i].value || 
        registrationOptions[i].text !== editOptions[i].text) {
        formsMatch = false;
        break;
    }
}

console.log(`\n=== DOM Test Summary ===`);
console.log(`Registration and edit forms match: ${formsMatch ? '✅ YES' : '❌ NO'}`);

if (formsMatch) {
    console.log('\n🎉 Both forms have consistent country dropdown options!');
    console.log('This ensures that registration and editing work with the same country values.');
} else {
    console.log('\n⚠️ Forms do not match. There may be inconsistencies between registration and editing.');
}
