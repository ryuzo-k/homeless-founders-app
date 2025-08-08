# 🚀 Homeless Founders Platform Setup

## Quick Start

### 1. Clone and Setup
```bash
git clone <repository-url>
cd homeless-founders
```

### 2. Configure API Keys
```bash
# Copy template to create your config file
cp config.template.js config.js

# Edit config.js with your API keys
nano config.js
```

### 3. Required API Keys

#### Supabase (Required)
1. Go to [supabase.com](https://supabase.com)
2. Create a project
3. Get URL and anon key from Settings > API

#### Resend Email (Required)
1. Go to [resend.com](https://resend.com)
2. Create account and get API key
3. Add to config.js

#### OpenAI (Optional)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Get API key
3. Add to config.js (system works without this)

### 4. Database Setup
Run the SQL scripts in your Supabase SQL editor:
- `minimal-setup.sql` - Basic tables and policies

### 5. Test the Platform
1. Open `index.html` in browser
2. Register a hacker house
3. Browse houses and apply

## Features
- ✅ No registration required for founders
- ✅ AI-powered feature extraction (optional)
- ✅ Email notifications to house owners
- ✅ Parental consent for minors
- ✅ Global database with real-time updates

## Security
- All API keys in `config.js` (not committed to git)
- Fallback systems for API failures
- Row Level Security on database
