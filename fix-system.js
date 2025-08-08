// COMPREHENSIVE FIX FOR HOMELESS FOUNDERS PLATFORM
// Run this script to fix duplicate display and email issues

// 1. Fix duplicate house display issue
window.fixDuplicateDisplay = function() {
    // Clear any existing intervals or duplicate listeners
    if (window.houseDisplayInterval) {
        clearInterval(window.houseDisplayInterval);
    }
    
    // Ensure only one house loading function exists
    window.loadHackerHousesListOnce = async function() {
        if (window.isLoadingHouses) return;
        window.isLoadingHouses = true;
        
        try {
            console.log('Loading houses from database...');
            const houses = await SupabaseDB.getAllHackerHouses();
            
            // Transform data
            const transformedHouses = houses.map(house => {
                let features = [];
                if (house.facilities) {
                    try {
                        if (typeof house.facilities === 'string' && house.facilities.startsWith('[')) {
                            features = JSON.parse(house.facilities);
                        } else if (Array.isArray(house.facilities)) {
                            features = house.facilities;
                        } else {
                            features = house.facilities.split(',').map(f => f.trim());
                        }
                    } catch (e) {
                        features = [];
                    }
                }
                
                return {
                    name: house.name,
                    location: house.location,
                    email: house.email,
                    description: house.description,
                    capacity: house.capacity,
                    features: features
                };
            });
            
            // Update Browse Houses page ONCE
            const browseContainer = document.getElementById('housesList');
            if (browseContainer) {
                browseContainer.innerHTML = transformedHouses.map(house => `
                    <div class="simple-card p-6">
                        <h3 class="text-xl font-bold mb-2">${house.name}</h3>
                        <p class="text-sm text-gray-600 mb-3">${house.location}</p>
                        <p class="text-sm mb-4">${house.description}</p>
                        <div class="mb-4">
                            <p class="text-xs font-bold mb-2">Features:</p>
                            <div class="flex flex-wrap gap-1">
                                ${house.features.map(feature => `
                                    <span class="px-2 py-1 border border-gray-300 text-xs rounded">${feature}</span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-bold">Capacity: ${house.capacity} founders</span>
                            <button onclick="showDirectApplicationForm('${house.name}', '${house.email}')" class="simple-button px-4 py-2 text-sm">
                                Apply to This House
                            </button>
                        </div>
                    </div>
                `).join('');
            }
            
            console.log('Houses loaded successfully:', transformedHouses.length);
            
        } catch (error) {
            console.error('Failed to load houses:', error);
        } finally {
            window.isLoadingHouses = false;
        }
    };
};

// 2. Fix email sending system
window.fixEmailSystem = function() {
    // Override email service to work properly
    if (typeof EmailService !== 'undefined') {
        const emailService = new EmailService();
        
        // Fix application email template
        emailService.generateApplicationEmailHTML = function(founderData, houseData, parentalConsentId) {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <style>
                        body { font-family: monospace; background: white; color: black; line-height: 1.6; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { border: 2px solid black; padding: 20px; margin-bottom: 20px; text-align: center; }
                        .content { border: 2px solid black; padding: 20px; margin-bottom: 20px; }
                        .section { margin-bottom: 20px; }
                        .label { font-weight: bold; }
                        .consent-notice { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; margin: 15px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🏠 New Founder Application</h1>
                            <p>Homeless Founders Platform</p>
                        </div>
                        
                        <div class="content">
                            <div class="section">
                                <h2>Applicant Information</h2>
                                <p><span class="label">Name:</span> ${founderData.name}</p>
                                <p><span class="label">Email:</span> ${founderData.email}</p>
                                <p><span class="label">Age:</span> ${founderData.age}</p>
                                <p><span class="label">Location:</span> ${founderData.location}</p>
                                <p><span class="label">Project:</span> ${founderData.project}</p>
                                <p><span class="label">Start Date:</span> ${founderData.startDate}</p>
                                <p><span class="label">End Date:</span> ${founderData.endDate}</p>
                                ${founderData.message ? `<p><span class="label">Message:</span> ${founderData.message}</p>` : ''}
                            </div>
                            
                            ${parentalConsentId ? `
                                <div class="consent-notice">
                                    <h3>✅ Parental Consent Provided</h3>
                                    <p>This applicant is under 18 and has provided valid parental consent.</p>
                                    <p><strong>Consent ID:</strong> ${parentalConsentId}</p>
                                </div>
                            ` : ''}
                            
                            <div class="section">
                                <h2>Next Steps</h2>
                                <p>Please review this application and contact the founder directly at ${founderData.email} if you'd like to proceed.</p>
                            </div>
                        </div>
                        
                        <div style="text-align: center; font-size: 12px; color: #666;">
                            <p>This email was sent via Homeless Founders Platform</p>
                            <p>Platform for introductions only. Users assume all risks.</p>
                        </div>
                    </div>
                </body>
                </html>
            `;
        };
        
        window.emailService = emailService;
    }
};

// 3. Initialize fixes
window.initializeFixes = function() {
    console.log('Initializing comprehensive fixes...');
    
    // Fix duplicate display
    window.fixDuplicateDisplay();
    
    // Fix email system
    window.fixEmailSystem();
    
    // Override the problematic functions
    window.loadHackerHousesList = window.loadHackerHousesListOnce;
    
    console.log('All fixes applied successfully!');
};

// Auto-initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializeFixes);
} else {
    window.initializeFixes();
}

console.log('Comprehensive fix script loaded. Run initializeFixes() to apply all fixes.');
