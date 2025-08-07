// DEBUG FIX FOR APPLICATION SUBMISSION
// Add this to the end of script.js or run in browser console

// Override the submitApplications function with better error handling
window.originalSubmitApplications = window.submitApplications;

window.submitApplications = async function() {
    console.log('DEBUG: submitApplications called');
    
    try {
        // Get form data with debugging
        const formData = {
            name: document.getElementById('appName')?.value,
            email: document.getElementById('appEmail')?.value,
            age: parseInt(document.getElementById('appAge')?.value),
            location: document.getElementById('appLocation')?.value,
            project: document.getElementById('appProject')?.value,
            startDate: document.getElementById('appStartDate')?.value,
            endDate: document.getElementById('appEndDate')?.value,
            message: document.getElementById('appMessage')?.value
        };
        
        console.log('DEBUG: Form data:', formData);
        
        // Check for missing elements
        const missingElements = [];
        if (!document.getElementById('appName')) missingElements.push('appName');
        if (!document.getElementById('appEmail')) missingElements.push('appEmail');
        if (!document.getElementById('appAge')) missingElements.push('appAge');
        if (!document.getElementById('appLocation')) missingElements.push('appLocation');
        if (!document.getElementById('appProject')) missingElements.push('appProject');
        if (!document.getElementById('appStartDate')) missingElements.push('appStartDate');
        if (!document.getElementById('appEndDate')) missingElements.push('appEndDate');
        if (!document.getElementById('appMessage')) missingElements.push('appMessage');
        
        if (missingElements.length > 0) {
            console.error('DEBUG: Missing form elements:', missingElements);
            alert('Missing form elements: ' + missingElements.join(', '));
            return;
        }
        
        // Validate required fields
        if (!formData.name || !formData.email || !formData.age || !formData.location || !formData.project || !formData.startDate || !formData.endDate) {
            console.error('DEBUG: Missing required fields');
            alert('Please fill in all required fields.');
            return;
        }
        
        console.log('DEBUG: Validation passed, calling original function');
        
        // Call original function
        return await window.originalSubmitApplications();
        
    } catch (error) {
        console.error('DEBUG: Application submission error:', error);
        console.error('DEBUG: Error message:', error.message);
        console.error('DEBUG: Error stack:', error.stack);
        alert('DEBUG ERROR: ' + error.message);
    }
};

console.log('DEBUG: submitApplications function overridden');
