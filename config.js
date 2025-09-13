// Production configuration for global users
// This enables the platform to work worldwide without user setup

// Get API keys from URL parameters or use production defaults
function getApiKey(keyName, defaultValue = '') {
    // Try to get from URL parameters first (for custom deployments)
    const urlParams = new URLSearchParams(window.location.search);
    const fromUrl = urlParams.get(keyName.toLowerCase());
    if (fromUrl) return fromUrl;
    
    // Try localStorage (for admin override)
    const stored = localStorage.getItem(keyName);
    if (stored) return stored;
    
    // Return production default
    return defaultValue;
}

const CONFIG = {
    // Supabase Configuration (Production - Global Access)
    SUPABASE_URL: getApiKey('SUPABASE_URL', 'https://ezwledxluhlwjnafgtxk.supabase.co'),
    SUPABASE_ANON_KEY: getApiKey('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d2xlZHhsdWhsd2puYWZndHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjY5NDcsImV4cCI6MjA3MDA0Mjk0N30.4AniVUMd1hIPrZ5a_9IgOKezbJqZDDsY-7ThmnhKJ2U'),
    
    // Resend Email API Configuration (Production - Global Email)
    RESEND_API_KEY: getApiKey('RESEND_API_KEY', 're_8XoCALVe_8ut7821d5mJRN94J69FfwG5F'),
    
    // OpenAI API Configuration (Production - AI Features)
    OPENAI_API_KEY: getApiKey('OPENAI_API_KEY', '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'),
    
    // Feature extraction settings
    FEATURE_EXTRACTION_ENABLED: true,
    FALLBACK_FEATURES: ['WiFi', 'Shared Kitchen', 'Coworking Space'],
    
    // Production mode
    DEV_MODE: false,
    
    // Logging configuration
    ENABLE_CONSOLE_LOGS: false
};

// Initialize OpenAI service with API key if available
if (typeof openAIService !== 'undefined' && CONFIG.OPENAI_API_KEY) {
    openAIService.setApiKey(CONFIG.OPENAI_API_KEY);
    console.log('🤖 OpenAI service initialized for global AI features');
} else if (typeof openAIService !== 'undefined') {
    console.log('⚠️ OpenAI service initialized without API key - using fallback mode');
}

console.log('🌍 Homeless Founders platform ready for global users');
