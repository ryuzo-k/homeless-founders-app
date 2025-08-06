# Homeless Founders - Global Hacker House Matching Platform

A modern web platform that connects talented founders with hacker houses worldwide using AI-powered matching.

## Features

- **Founder Registration**: Founders can register with their details and preferences
- **Hacker House Listings**: House owners can list their properties with amenities
- **AI Matching**: Smart algorithm matches founders with suitable hacker houses
- **Real-time Database**: Powered by Supabase for data persistence
- **Responsive Design**: Clean, minimalist black and white interface
- **Global Deployment Ready**: Built for worldwide production use

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Fonts**: Space Mono, JetBrains Mono
- **Deployment**: Static hosting compatible (Netlify, Vercel, etc.)

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to Settings > API
4. Copy your project URL and anon key
5. Run the SQL schema in your Supabase SQL editor:

```sql
-- Copy and paste the contents of database-schema.sql
```

### 2. Configuration

1. Open `supabase-config.js`
2. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'YOUR_ACTUAL_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_ACTUAL_SUPABASE_ANON_KEY';
```

### 3. Local Development

1. Start a local server:
```bash
python3 -m http.server 8000
# or
npx serve .
```

2. Open http://localhost:8000 in your browser

### 4. Production Deployment

#### Option A: Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: (none needed for static site)
3. Set publish directory: `/`
4. Deploy

#### Option B: Vercel
1. Import your project to Vercel
2. Deploy as static site

#### Option C: Custom Server
1. Upload all files to your web server
2. Ensure HTTPS is enabled
3. Configure your domain

## Database Schema

The platform uses three main tables:

- **founders**: Stores founder registration data
- **hacker_houses**: Stores hacker house listings
- **matches**: Tracks matching relationships and scores

## Security Features

- Row Level Security (RLS) enabled on all tables
- Public read/write policies for demo (customize for production)
- Input validation and sanitization
- HTTPS required for production

## Customization

### Styling
- Modify CSS variables in the `<style>` section of `index.html`
- Current theme: Minimalist black and white
- Fonts: Space Mono (primary), JetBrains Mono (code)

### Matching Algorithm
- Located in `simulateAIMatching()` function in `script.js`
- Customize scoring weights and keywords
- Add new criteria as needed

### Regions
- Add new regions in the region dropdown options
- Update `getRegionName()` and `getRegionEmoji()` functions
- Add timezone support in `getCurrentTimeInRegion()`

## API Integration

The platform is ready for additional integrations:

- Email notifications (SendGrid, Mailgun)
- Payment processing (Stripe)
- Video calls (Zoom, Google Meet)
- Messaging (Twilio, Discord)

## Environment Variables

For production, consider using environment variables:

```javascript
const SUPABASE_URL = process.env.SUPABASE_URL || 'fallback-url';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'fallback-key';
```

## Performance Optimization

- All assets are CDN-hosted (Tailwind, Supabase)
- Minimal JavaScript bundle
- Optimized database queries with indexes
- Responsive images and lazy loading ready

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use for commercial projects.

## Support

For issues or questions:
- Check the browser console for errors
- Verify Supabase configuration
- Ensure all required fields are filled
- Test with different browsers

## Roadmap

- [ ] User authentication system
- [ ] Advanced filtering options
- [ ] Real-time messaging
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Multi-language support
- [ ] Payment integration

---

Built with ❤️ for the global startup community.
