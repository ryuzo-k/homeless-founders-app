// Configuration template file
// Copy this to config.js and fill in your API keys

const CONFIG = {
    // Supabase Configuration
    SUPABASE_URL: 'your-supabase-url-here',
    SUPABASE_ANON_KEY: 'your-supabase-anon-key-here',
    
    // Resend Email API Configuration
    RESEND_API_KEY: 'your-resend-api-key-here',
    
    // OpenAI API Configuration
    OPENAI_API_KEY: '', // Optional - system works without this
    
    // Feature extraction settings
    FEATURE_EXTRACTION_ENABLED: true,
    FALLBACK_FEATURES: ['WiFi', 'Shared Kitchen', 'Coworking Space'],
    
    // Development mode
    DEV_MODE: true
};

// Initialize services with API keys if available
if (typeof openAIService !== 'undefined' && CONFIG.OPENAI_API_KEY) {
    openAIService.setApiKey(CONFIG.OPENAI_API_KEY);
    console.log('OpenAI service initialized with API key');
} else if (typeof openAIService !== 'undefined') {
    console.log('OpenAI service initialized without API key - using fallback mode');
}
