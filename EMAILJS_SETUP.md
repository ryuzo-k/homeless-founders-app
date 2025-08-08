# EmailJS Setup Instructions for Homeless Founders

## Overview
EmailJS allows sending emails directly from the browser without a backend server. This is perfect for the Homeless Founders application system.

## Setup Steps

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (100 emails/month free)
3. Verify your email address

### 2. Create Email Service
1. In EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. Note down the **Service ID** (e.g., `service_homeless_founders`)

### 3. Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template content:

```
Subject: 🏠 New Founder Application: {{from_name}}

Hello {{to_name}},

You have received a new application through the Homeless Founders platform.

**Applicant Details:**
- Name: {{from_name}}
- Email: {{from_email}}
- Age: {{applicant_age}}
- Location: {{applicant_location}}

**Project Description:**
{{project_description}}

**Stay Duration:**
From: {{start_date}}
To: {{end_date}}

**Additional Message:**
{{message}}

**Parental Consent:** {{has_parental_consent}}

**Platform:** {{platform}}

---
Please reply directly to {{from_email}} to contact the applicant.

Best regards,
Homeless Founders Platform
```

4. Note down the **Template ID** (e.g., `template_application`)

### 4. Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

### 5. Update Configuration
Update the EmailJS configuration in `email-service.js`:

```javascript
this.serviceId = 'your_service_id_here';
this.templateId = 'your_template_id_here';
this.publicKey = 'your_public_key_here';
```

## Testing
1. Open the application in browser
2. Submit a test application
3. Check if emails are received
4. Monitor EmailJS dashboard for delivery status

## Troubleshooting
- Check browser console for errors
- Verify all IDs are correct
- Ensure email service is properly configured
- Check EmailJS dashboard for error logs

## Benefits of EmailJS
- ✅ No backend server required
- ✅ Works directly from browser
- ✅ Free tier available
- ✅ Easy setup and configuration
- ✅ Reliable delivery
- ✅ Real-time monitoring
