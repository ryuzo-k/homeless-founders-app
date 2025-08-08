// Supabase Database Operations
class SupabaseDatabase {
    constructor() {
        this.client = supabaseClient;
    }

    // Get all hacker houses
    async getAllHackerHouses() {
        try {
            const { data, error } = await this.client
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

    // Create new hacker house
    async createHackerHouse(houseData) {
        try {
            const { data, error } = await this.client
                .from('hacker_houses')
                .insert([houseData])
                .select()
                .single();
            
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error creating hacker house:', error);
            throw error;
        }
    }

    // Update hacker house
    async updateHackerHouse(id, updateData) {
        try {
            const { data, error } = await this.client
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
            const { error } = await this.client
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
            const { data, error } = await this.client
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
            const { data, error } = await this.client
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
