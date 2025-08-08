# 🤖 OpenAI Feature Extraction Setup

## Overview
This platform automatically extracts features from hacker house descriptions using OpenAI's GPT-3.5-turbo.

## Setup Instructions

### 1. Get OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or log in
3. Generate a new API key

### 2. Configure API Key
1. Open `config.js`
2. Replace the empty string with your API key:
```javascript
const CONFIG = {
    OPENAI_API_KEY: 'your-api-key-here', // Add your key here
    // ... other settings
};
```

### 3. How It Works
When a hacker house is registered:
1. **Description Analysis**: OpenAI analyzes the house description
2. **Feature Extraction**: AI extracts 3-6 key features/amenities
3. **Auto-Population**: Features appear in Browse Houses listings

### Example Features Extracted
- **Physical**: "High-Speed WiFi", "Shared Kitchen", "Gym Access"
- **Location**: "City Center", "Near Station", "Beach Access"  
- **Community**: "24/7 Access", "Coworking Space", "Meeting Room"

### Fallback System
If OpenAI API is unavailable:
- Uses intelligent text parsing
- Falls back to default features: ["WiFi", "Shared Kitchen", "Coworking Space"]

### Security
- API keys should never be committed to version control
- Use environment variables for production deployments
- The system works without API keys (fallback mode)

## Testing
1. Register a new hacker house with a detailed description
2. Watch the "🤖 Analyzing description..." loading state
3. Check Browse Houses to see extracted features

## Cost Optimization
- Uses GPT-3.5-turbo (cost-effective)
- Short prompts and responses
- Fallback prevents failures
- Approximately $0.001-0.002 per house registration
