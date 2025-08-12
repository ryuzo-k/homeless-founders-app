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
                .select('*')
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
            
            const { data, error } = await client
                .from('hacker_houses')
                .insert([houseData])
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
    async updateHackerHouse(id, updateData) {
        try {
            const client = this.getClient();
            if (!client) throw new Error('Supabase client not initialized');
            
            const { data, error } = await client
                .from('hacker_houses')
                .update(updateData)
                .eq('id', id)
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
                .select('*')
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
