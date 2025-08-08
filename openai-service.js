class OpenAIService {
    constructor() {
        // API key should be set via setApiKey method or config file
        this.apiKey = null;
        this.baseUrl = 'https://api.openai.com/v1';
    }
    
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    async extractFeatures(description) {
        try {
            console.log('Extracting features from description:', description);
            
            if (!this.apiKey) {
                console.warn('OpenAI API key not set, using fallback feature extraction');
                return this.fallbackFeatureExtraction(description);
            }
            
            const response = await fetch(`${this.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a feature extraction AI for hacker houses. Extract 3-6 key features/amenities from the house description. Return ONLY a JSON array of short feature names (1-3 words each). Focus on:

- Physical amenities (WiFi, Kitchen, Gym, etc.)
- Location benefits (City Center, Beach, etc.) 
- Community aspects (24/7 Access, Coworking, etc.)
- Unique features mentioned

Example output: ["High-Speed WiFi", "Shared Kitchen", "Rooftop Access", "24/7 Security"]

Be concise and practical. No explanations, just the JSON array.`
                        },
                        {
                            role: 'user',
                            content: description
                        }
                    ],
                    max_tokens: 150,
                    temperature: 0.3
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            
            console.log('OpenAI response:', content);
            
            // Parse the JSON response
            try {
                const features = JSON.parse(content);
                if (Array.isArray(features)) {
                    console.log('Extracted features:', features);
                    return features;
                } else {
                    throw new Error('Response is not an array');
                }
            } catch (parseError) {
                console.error('Failed to parse OpenAI response as JSON:', parseError);
                // Fallback: extract features manually from text
                return this.fallbackFeatureExtraction(content);
            }

        } catch (error) {
            console.error('Error extracting features:', error);
            // Return some default features based on common hacker house amenities
            return this.getDefaultFeatures();
        }
    }

    fallbackFeatureExtraction(text) {
        // Simple fallback extraction from text
        const commonFeatures = [
            'WiFi', 'Kitchen', 'Coworking', 'Gym', 'Rooftop', 'Garden', 
            'Parking', 'Security', '24/7 Access', 'Meeting Room', 'Printer',
            'Coffee', 'Laundry', 'Storage', 'Bike Storage', 'City Center',
            'Near Station', 'Quiet Area', 'Beach Access', 'Mountain View'
        ];
        
        const foundFeatures = [];
        const lowerText = text.toLowerCase();
        
        for (const feature of commonFeatures) {
            if (lowerText.includes(feature.toLowerCase()) && foundFeatures.length < 6) {
                foundFeatures.push(feature);
            }
        }
        
        return foundFeatures.length > 0 ? foundFeatures : this.getDefaultFeatures();
    }

    getDefaultFeatures() {
        return ['WiFi', 'Shared Kitchen', 'Coworking Space'];
    }
}

// Create global instance
const openAIService = new OpenAIService();
