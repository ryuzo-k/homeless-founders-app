# Email Setup Instructions

## 1. Resend Account Setup

1. Go to [resend.com](https://resend.com) and create a free account
2. Verify your email address
3. Go to API Keys section and create a new API key
4. Copy the API key (starts with `re_`)

## 2. Domain Setup (Optional but Recommended)

1. Add your domain in Resend dashboard
2. Add the required DNS records to verify domain ownership
3. Update the `from` email in `email-service.js` to use your domain

## 3. Environment Configuration

1. Copy `.env.example` to `.env`
2. Add your Resend API key:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```

## 4. Update Email Service

In `email-service.js`, update the `from` email address:
```javascript
from: 'noreply@yourdomain.com', // Replace with your verified domain
```

## 5. Testing

1. Complete the Parental Consent Form
2. Apply to a hacker house as a minor
3. Check that emails are sent to both parent and house

## Free Limits

- Resend free plan: 3,000 emails/month
- No credit card required for free tier

## Production Deployment

For production, make sure to:
1. Set environment variables in your hosting platform
2. Use a verified domain for better deliverability
3. Monitor email sending logs in Resend dashboard
