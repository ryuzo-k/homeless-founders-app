// Supabase configuration
const SUPABASE_URL = 'https://ezwledxluhlwjnafgtxk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d2xlZHhsdWhsd2puYWZndHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjY5NDcsImV4cCI6MjA3MDA0Mjk0N30.4AniVUMd1hIPrZ5a_9IgOKezbJqZDDsY-7ThmnhKJ2U';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table names
const TABLES = {
    FOUNDERS: 'founders',
    HACKER_HOUSES: 'hacker_houses',
    MATCHES: 'matches'
};

// Supabase database functions
const SupabaseDB = {
    // Founder operations
    async createFounder(founderData) {
        const { data, error } = await supabase
            .from(TABLES.FOUNDERS)
            .insert([{
                name: founderData.name,
                age: founderData.age,
                product: founderData.product,
                start_date: founderData.startDate,
                end_date: founderData.endDate,
                region: founderData.region,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) {
            console.error('Error creating founder:', error);
            throw error;
        }
        return data[0];
    },

    async getFounders() {
        const { data, error } = await supabase
            .from(TABLES.FOUNDERS)
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching founders:', error);
            throw error;
        }
        return data;
    },

    // Hacker house operations
    async createHackerHouse(houseData) {
        const { data, error } = await supabase
            .from(TABLES.HACKER_HOUSES)
            .insert([{
                name: houseData.name,
                location: houseData.location,
                region: houseData.region,
                description: houseData.description,
                capacity: houseData.capacity,
                email: houseData.email,
                preferences: houseData.preferences,
                facilities: houseData.facilities,
                image: houseData.image,
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) {
            console.error('Error creating hacker house:', error);
            throw error;
        }
        return data[0];
    },

    async getHackerHouses() {
        const { data, error } = await supabase
            .from(TABLES.HACKER_HOUSES)
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching hacker houses:', error);
            throw error;
        }
        return data;
    },

    // Match operations
    async createMatch(matchData) {
        const { data, error } = await supabase
            .from(TABLES.MATCHES)
            .insert([{
                founder_id: matchData.founderId,
                house_id: matchData.houseId,
                match_score: matchData.matchScore,
                status: 'pending',
                created_at: new Date().toISOString()
            }])
            .select();
        
        if (error) {
            console.error('Error creating match:', error);
            throw error;
        }
        return data[0];
    },

    async getMatches() {
        const { data, error } = await supabase
            .from(TABLES.MATCHES)
            .select(`
                *,
                founders (name, product),
                hacker_houses (name, location)
            `)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching matches:', error);
            throw error;
        }
        return data;
    }
};

// Export for use in other files
window.SupabaseDB = SupabaseDB;
