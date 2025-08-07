// Supabase configuration
const SUPABASE_URL = 'https://ezwledxluhlwjnafgtxk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6d2xlZHhsdWhsd2puYWZndHhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NjY5NDcsImV4cCI6MjA3MDA0Mjk0N30.4AniVUMd1hIPrZ5a_9IgOKezbJqZDDsY-7ThmnhKJ2U';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database table names
const TABLES = {
    FOUNDERS: 'founders',
    HACKER_HOUSES: 'hacker_houses',
    MATCHES: 'matches',
    PARENTAL_CONSENTS: 'parental_consents'
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
                email: founderData.email,
                product: founderData.product,
                start_date: founderData.startDate,
                end_date: founderData.endDate,
                region: founderData.region,
                parental_consent_id: founderData.parentalConsentId || null,
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
                preferences: houseData.preferences || null,
                facilities: houseData.facilities || [],
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

    async updateHackerHouse(email, updatedData) {
        const { data, error } = await supabase
            .from(TABLES.HACKER_HOUSES)
            .update({
                name: updatedData.name,
                location: updatedData.location,
                description: updatedData.description,
                capacity: updatedData.capacity,
                updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select();
        
        if (error) {
            console.error('Error updating hacker house:', error);
            throw error;
        }
        return data[0];
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
                parental_consent_id: matchData.parentalConsentId || null,
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
    },
    // Parental consent operations
    async createParentalConsent(consentData) {
        const { data, error } = await supabase
            .from(TABLES.PARENTAL_CONSENTS)
            .insert([{ ...consentData, created_at: new Date().toISOString() }])
            .select()
            .single();
        if (error) {
            console.error('Error creating parental consent:', error);
            throw error;
        }
        return data;
    },

    // Email notification function
    async sendApplicationEmail(founderData, houseData, parentalConsentId = null) {
        try {
            // Use EmailService if available, otherwise fallback to logging
            if (typeof EmailService !== 'undefined') {
                const emailService = new EmailService();
                return await emailService.sendApplicationEmail(founderData, houseData, parentalConsentId);
            } else {
                // Fallback to console logging
                const emailContent = {
                    to: houseData.email,
                    subject: `New Application: ${founderData.name}`,
                    html: `
                        <h2>New Founder Application</h2>
                        <p><strong>Name:</strong> ${founderData.name}</p>
                        <p><strong>Age:</strong> ${founderData.age}</p>
                        <p><strong>Product:</strong> ${founderData.product}</p>
                        <p><strong>Stay Duration:</strong> ${founderData.startDate} - ${founderData.endDate}</p>
                        <p><strong>Email:</strong> ${founderData.email}</p>
                        ${parentalConsentId ? '<p><strong>Note:</strong> This applicant is a minor. Parental consent form is attached.</p>' : ''}
                        <hr>
                        <p>Please review this application and respond accordingly.</p>
                    `
                };
                
                console.log('Email to be sent:', emailContent);
                return emailContent;
            }
        } catch (error) {
            console.error('Email sending failed:', error);
            // Don't throw error to avoid breaking the application flow
            return null;
        }
    }
};

// ユーザープロファイル機能
const SupabaseProfiles = {
    // プロファイル作成
    async createProfile(userId, userType, fullName) {
        const { data, error } = await supabase
            .from('user_profiles')
            .insert({
                id: userId,
                user_type: userType,
                full_name: fullName
            })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    // プロファイル取得
    async getProfile(userId) {
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();
        if (error) throw error;
        return data;
    },

    // プロファイル更新
    async updateProfile(userId, updates) {
        const { data, error } = await supabase
            .from('user_profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

// 認証機能
const SupabaseAuth = {
    // サインアップ（ユーザータイプ付き）
    async signUp(email, password, userType, fullName) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    user_type: userType
                }
            }
        });
        if (error) throw error;
        
        // プロファイル作成（ユーザー確認後に自動実行される）
        if (data.user) {
            try {
                await SupabaseProfiles.createProfile(data.user.id, userType, fullName);
            } catch (profileError) {
                console.log('Profile will be created after email confirmation');
            }
        }
        
        return data;
    },

    // Sign in with email and password
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            console.error('Sign in error:', error);
            throw error;
        }
        return data;
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    },

    // Get current user
    async getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    },

    // Get current session
    async getCurrentSession() {
        const { data: { session } } = await supabase.auth.getSession();
        return session;
    },

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback);
    }
};

// Export for use in other files
window.SupabaseDB = SupabaseDB;
window.SupabaseAuth = SupabaseAuth;
