// Supabase Database Operations
class SupabaseDatabase {
    constructor() {
        // Initialize client when needed, not in constructor
        this.client = null;
    }
    
    getClient() {
        if (!this.client && typeof supabaseClient !== 'undefined') {
            this.client = supabaseClient;
        }
        return this.client;
    }

    // Get all hacker houses
    async getAllHackerHouses() {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase client not initialized');
            
            const { data, error } = await client
                .from('hacker_houses')
                .select('id, name, location, region, country, description, capacity, email, preferences, facilities, image, sns, created_at, updated_at')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Error fetching hacker houses:', error);
            return [];
        }
    }

    // Alias for getAllHackerHouses (for compatibility)
    async getHackerHouses() {
        return this.getAllHackerHouses();
    }

    // Create new hacker house
    async createHackerHouse(houseData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase client not initialized');
            
            console.log('🔍 Supabase createHackerHouse called with:', houseData);
            console.log('🔍 Data fields:', Object.keys(houseData));
            
            // Ensure country field is included in the insert
            const { data, error } = await client
                .from('hacker_houses')
                .insert([{
                    name: houseData.name,
                    location: houseData.location,
                    region: houseData.region,
                    country: houseData.country,
                    description: houseData.description,
                    capacity: houseData.capacity,
                    email: houseData.email,
                    preferences: houseData.preferences,
                    facilities: houseData.facilities,
                    image: houseData.image,
                    sns: houseData.sns
                }])
                .select()
                .single();
            
            if (error) {
                console.error('❌ Supabase error details:', error);
                console.error('❌ Error message:', error.message);
                console.error('❌ Error code:', error.code);
                console.error('❌ Error details:', error.details);
                throw error;
            }
            
            console.log('✅ Supabase insert successful:', data);
            return data;
        } catch (error) {
            console.error('💥 Error creating hacker house:', error);
            throw error;
        }
    }

    // Update hacker house
    async updateHackerHouse(email, updateData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase client not initialized');
            
            // Ensure country field is included in the update
            const { data, error } = await client
                .from('hacker_houses')
                .update({
                    name: updateData.name,
                    location: updateData.location,
                    region: updateData.region,
                    country: updateData.country,
                    description: updateData.description,
                    capacity: updateData.capacity,
                    email: updateData.email,
                    preferences: updateData.preferences,
                    facilities: updateData.facilities,
                    image: updateData.image,
                    sns: updateData.sns
                })
                .eq('email', email)
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error updating hacker house:', error);
            throw error;
        }
    }

    // Delete hacker house
    async deleteHackerHouse(id) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase client not initialized');
            
            const { error } = await client
                .from('hacker_houses')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting hacker house:', error);
            throw error;
        }
    }

    // Get hacker house by ID
    async getHackerHouseById(id) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase client not initialized');
            
            const { data, error } = await client
                .from('hacker_houses')
                .select('id, name, location, region, country, description, capacity, email, preferences, facilities, image, sns, created_at, updated_at')
                .eq('id', id)
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching hacker house:', error);
            return null;
        }
    }

    // Test connection
    async testConnection() {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase client not initialized');
            
            const { data, error } = await client
                .from('hacker_houses')
                .select('count')
                .limit(1);
            
            if (error) throw error;
            console.log('✅ Supabase connection successful');
            return true;
        } catch (error) {
            console.error('❌ Supabase connection failed:', error);
            return false;
        }
    }
}

// Initialize global SupabaseDB instance
const SupabaseDB = new SupabaseDatabase();

// Test connection on load
if (typeof supabaseClient !== 'undefined') {
    SupabaseDB.testConnection();
}
