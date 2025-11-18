import { supabase } from "./supabase";

/**
 * 
 * @param {String} id
 * @returns {Promise<{id: String, email: String, bio: String|null, display_name: String|null, profession: String|null}>}
 */
export async function getProfileById(id) {
    const {data, error} = await supabase
        .from('user_profiles')
        .select()
        .eq('id', id)
        .limit(1)
        .single();

    if(error) {
        console.error(id, error);
        throw new Error(error.message);
        
    }

    return data;
}

/**
 * 
 * @param {{id: String, email: String, bio?: String|null, display_name?: String|null, profession?: String|null}} data 
 */
export async function createUserProfile(data) {
    const { error } = await supabase
        .from('user_profiles')
        .insert(data);

        if(error){
        console.error(error)
        throw new Error(error.message);
    } 
}

/**
 * @param {String} id 
 * @param {{bio?: String|null, display_name?: String|null, profession?: String|null}} newData 
 */
export async function updateUserProfile(id, newData) {
    const { data, error } = await supabase
    .from('user_profiles')
    .update(newData) 
    .eq('id', id);

    if(error){
        console.error(id, error)
        throw new Error(error.message);
        
    }
}

