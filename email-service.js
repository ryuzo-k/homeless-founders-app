// Email service using Resend API
class EmailService {
    constructor() {
        // Get API key from environment or config
        this.apiKey = process.env.RESEND_API_KEY || 'your-resend-api-key';
        this.baseUrl = 'https://api.resend.com';
    }

    async sendApplicationEmail(founderData, houseData, parentalConsentId = null) {
        const emailData = {
            from: 'noreply@homeless-founders.com',
            to: houseData.email,
            subject: `New Application: ${founderData.name}`,
            html: this.generateApplicationEmailHTML(founderData, houseData, parentalConsentId)
        };

        try {
            const response = await fetch(`${this.baseUrl}/emails`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                throw new Error(`Email API error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Email sent successfully:', result);
            return result;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    async sendParentalConsentConfirmation(parentEmail, minorName) {
        const emailData = {
            from: 'noreply@homeless-founders.com',
            to: parentEmail,
            subject: `Parental Consent Confirmation - ${minorName}`,
            html: this.generateConsentConfirmationHTML(minorName)
        };

        try {
            const response = await fetch(`${this.baseUrl}/emails`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                throw new Error(`Email API error: ${response.status}`);
            }

            const result = await response.json();
            console.log('Consent confirmation email sent:', result);
            return result;
        } catch (error) {
            console.error('Consent confirmation email failed:', error);
            throw error;
        }
    }

    generateApplicationEmailHTML(founderData, houseData, parentalConsentId) {
        const isMinor = parentalConsentId ? true : false;
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: monospace; background: white; color: black; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { border: 2px solid black; padding: 20px; margin-bottom: 20px; }
                    .content { border: 2px solid black; padding: 20px; }
                    .minor-notice { background: #fff3cd; border: 2px solid #856404; padding: 15px; margin: 15px 0; }
                    .button { background: white; border: 2px solid black; padding: 10px 20px; text-decoration: none; color: black; display: inline-block; margin: 10px 0; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏠 New Founder Application</h1>
                        <p><strong>House:</strong> ${houseData.name}</p>
                    </div>
                    
                    <div class="content">
                        <h2>Applicant Information</h2>
                        <p><strong>Name:</strong> ${founderData.name}</p>
                        <p><strong>Age:</strong> ${founderData.age}</p>
                        <p><strong>Email:</strong> ${founderData.email}</p>
                        <p><strong>Stay Duration:</strong> ${founderData.startDate} to ${founderData.endDate}</p>
                        <p><strong>Product/Project:</strong></p>
                        <p style="border: 1px solid #ccc; padding: 10px; background: #f9f9f9;">${founderData.product}</p>
                        
                        ${isMinor ? `
                        <div class="minor-notice">
                            <h3>⚠️ MINOR APPLICANT</h3>
                            <p>This applicant is under 18 years old. Parental consent has been obtained and is on file.</p>
                            <p><strong>Parental Consent ID:</strong> ${parentalConsentId}</p>
                            <p><strong>Important:</strong> Please ensure all arrangements are approved by the parent/guardian before accepting this application.</p>
                        </div>
                        ` : ''}
                        
                        <h3>Next Steps</h3>
                        <ol>
                            <li>Review the application details above</li>
                            <li>Contact the applicant at ${founderData.email}</li>
                            <li>Schedule an interview if interested</li>
                            ${isMinor ? '<li>Coordinate with parent/guardian for all arrangements</li>' : ''}
                        </ol>
                        
                        <a href="mailto:${founderData.email}" class="button">Reply to Applicant</a>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
                        <p>This email was sent automatically by Homeless Founders platform.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    generateConsentConfirmationHTML(minorName) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: monospace; background: white; color: black; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { border: 2px solid black; padding: 20px; margin-bottom: 20px; }
                    .content { border: 2px solid black; padding: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Parental Consent Confirmation</h1>
                    </div>
                    
                    <div class="content">
                        <p>Dear Parent/Guardian,</p>
                        
                        <p>This email confirms that we have received your parental consent form for <strong>${minorName}</strong> to use the Homeless Founders platform.</p>
                        
                        <h3>What happens next:</h3>
                        <ol>
                            <li>${minorName} can now apply to hacker houses</li>
                            <li>You will be contacted directly for any applications</li>
                            <li>All arrangements require your approval</li>
                            <li>You can contact us anytime with questions</li>
                        </ol>
                        
                        <p><strong>Important:</strong> Please ensure you approve all accommodation arrangements before your child stays at any location.</p>
                        
                        <p>Thank you for your trust in our platform.</p>
                        
                        <p>Best regards,<br>Homeless Founders Team</p>
                    </div>
                    
                    <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
                        <p>This email was sent automatically by Homeless Founders platform.</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }
}

// Export for use in other files
window.EmailService = EmailService;
