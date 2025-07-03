// Legacy Supabase client - replaced with new API
// This is a stub to prevent import errors during migration

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: { session: null }, error: new Error('Use new API') }),
    signUp: () => Promise.resolve({ data: { session: null }, error: new Error('Use new API') }),
    signOut: () => Promise.resolve({ error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    resetPasswordForEmail: () => Promise.resolve({ data: null, error: new Error('Use new API') }),
    updateUser: () => Promise.resolve({ data: null, error: new Error('Use new API') }),
    onAuthStateChange: () => ({ data: { subscription: null }, error: null })
  },
  from: () => ({
    select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    insert: () => Promise.resolve({ data: [], error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) })
  })
};

// Helper to validate UUID format
const isValidUUID = (uuid: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

// Authentication helpers
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signUp = async (email: string, password: string, userData?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

export const resetPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  
  return { data, error };
};

export const updatePassword = async (password: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  return { data, error };
};

// Database helper functions
export const fetchBusinessAnalysis = async (userId?: string) => {
  try {
    const query = supabase
      .from('business_analyzer')
      .select('*');
    
    if (userId) {
      query.eq('user_id', userId);
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    console.error("Error fetching business analyses:", err);
    return { data: null, error: err };
  }
};

export const createBusinessAnalysis = async (analysisData: any) => {
  try {
    const { data, error } = await supabase
      .from('business_analyzer')
      .insert([analysisData])
      .select();
    
    return { data, error };
  } catch (err) {
    console.error("Error creating business analysis:", err);
    return { data: null, error: err };
  }
};

const updateBusinessAnalysis = async (id: number, analysisData: any) => {
  const { data, error } = await supabase
    .from('business_analyzer')
    .update(analysisData)
    .eq('id', id);
  
  return { data, error };
};

const deleteBusinessAnalysis = async (id: number) => {
  const { error } = await supabase
    .from('business_analyzer')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Content Items
export const fetchContentItems = async (userId?: string) => {
  const query = supabase
    .from('content_items')
    .select('*');
  
  if (userId) {
    query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createContentItem = async (contentData: any) => {
  const { data, error } = await supabase
    .from('content_items')
    .insert([contentData]);
  
  return { data, error };
};

const updateContentItem = async (id: string, contentData: any) => {
  const { data, error } = await supabase
    .from('content_items')
    .update(contentData)
    .eq('id', id);
  
  return { data, error };
};

export const deleteContentItem = async (id: string) => {
  const { error } = await supabase
    .from('content_items')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Voice Profiles
export const fetchVoiceProfiles = async (userId?: string) => {
  const query = supabase
    .from('voice_profiles')
    .select('*');
  
  if (userId) {
    query.eq('user_id', userId);
  }
  
  const { data, error } = await query;
  return { data, error };
};

export const createVoiceProfile = async (profileData: any) => {
  const { data, error } = await supabase
    .from('voice_profiles')
    .insert([profileData]);
  
  return { data, error };
};

export const updateVoiceProfile = async (id: string, profileData: any) => {
  const { data, error } = await supabase
    .from('voice_profiles')
    .update(profileData)
    .eq('id', id);
  
  return { data, error };
};

export const deleteVoiceProfile = async (id: string) => {
  const { error } = await supabase
    .from('voice_profiles')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Image Assets
const fetchImageAssets = async (userId?: string) => {
  try {
    const query = supabase
      .from('image_assets')
      .select('*');
    
    if (userId) {
      // Skip filtering if userId is not a valid UUID
      if (isValidUUID(userId)) {
        query.eq('user_id', userId);
      } else {
        console.warn(`Invalid UUID format for user_id: ${userId}. Returning all images instead.`);
        // If you want to return empty results for invalid UUIDs, uncomment the following:
        // return { data: [], error: null };
      }
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    console.error("Error fetching image assets:", err);
    return { data: null, error: err };
  }
};

const createImageAsset = async (assetData: any) => {
  try {
    // Check if user_id is a valid UUID
    if (assetData.user_id && !isValidUUID(assetData.user_id)) {
      console.error("Invalid UUID format for user_id when creating image asset");
      return { data: null, error: new Error("Invalid UUID format for user_id") };
    }
    
    const { data, error } = await supabase
      .from('image_assets')
      .insert([assetData]);
    
    return { data, error };
  } catch (err) {
    console.error("Error creating image asset:", err);
    return { data: null, error: err };
  }
};

const updateImageAsset = async (id: string, assetData: any) => {
  const { data, error } = await supabase
    .from('image_assets')
    .update(assetData)
    .eq('id', id);
  
  return { data, error };
};

const deleteImageAsset = async (id: string) => {
  const { error } = await supabase
    .from('image_assets')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Edge Function Helpers
export const callEdgeFunction = async (functionName: string, payload: any) => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!supabaseUrl) {
      throw new Error("Supabase URL is not defined");
    }
    
    if (!openaiApiKey) {
      throw new Error("OpenAI API Key is not defined in environment variables");
    }
    
    const apiUrl = `${supabaseUrl}/functions/v1/${functionName}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
    };
    
    // Add OpenAI API key to headers with the correct header name
    // The edge function is expecting "OPENAI_API_KEY" not "X-OpenAI-Api-Key"
    if (openaiApiKey) {
      headers['OPENAI_API_KEY'] = openaiApiKey;
    }
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error calling ${functionName}: ${response.status} - ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling edge function ${functionName}:`, error);
    throw error;
  }
};

// Contacts
export const fetchContacts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId);
      
    return { data, error };
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return { data: null, error: err };
  }
};

export const createContact = async (contactData: any) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contactData])
      .select();
      
    return { data, error };
  } catch (err) {
    console.error("Error creating contact:", err);
    return { data: null, error: err };
  }
};

export const updateContact = async (id: string, contactData: any) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update(contactData)
      .eq('id', id)
      .select();
      
    return { data, error };
  } catch (err) {
    console.error("Error updating contact:", err);
    return { data: null, error: err };
  }
};

export const deleteContact = async (id: string) => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
      
    return { error };
  } catch (err) {
    console.error("Error deleting contact:", err);
    return { error: err };
  }
};

export const getContactById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
      
    return { data, error };
  } catch (err) {
    console.error("Error getting contact:", err);
    return { data: null, error: err };
  }
};