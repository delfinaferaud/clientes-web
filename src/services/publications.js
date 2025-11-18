import { supabase } from './supabase';

/**
 * @param {{sender_id: String, email: String, content: String}} data
 */

export async function savePublications(data) {
  const { error } = await supabase.from('publications').insert({
    sender_id: data.sender_id,
    email: data.email,
    content: data.content,
  });

  if (error) {
    console.error('error en la base de datos ', error);
    throw new Error(error.message);
  }
}

/**
 * 
 * @returns {Promise<{id: number, email: String, content: String, created_at: String}[]>}
 */

export async function fetchPublications() {
  const { data, error } = await supabase.from('publications').select();

  if (error) {
    console.error('error en la base de datos ', error);

    throw new Error(error);
  }
  return data;
}

/**
 * @param {({id: number, email: String, content: String, created_at: String}) => void} callback
 * @returns {() => void}
 */

export function subscribeToPublications(callback) {
    const publications = supabase.channel('publications');
        publications.on(
            'postgres_changes',
            {
                event: 'INSERT',
                table: 'publications',
                schema: 'public'
            },
            payload => {
                callback(payload.new);
            }
        )
        publications.subscribe();

        return () => {
          publications.unsubscribe();
        }
}
