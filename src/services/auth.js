import { createUserProfile, getProfileById, updateUserProfile } from "./profile";
import { supabase } from "./supabase";

let user = {
    id: null,
    email: null,
}

let observers = [];

loadUserCurrentAuthState();

async function loadUserCurrentAuthState() {
    const {data, error} = await supabase.auth.getUser();

    if(error) {
        console.warn('no hay un usuario autenticado');
        return
    }

    setUser({
        id: data.user.id,
        email: data.user.email
    })

    loadExtendedProfile(); 
}

async function loadExtendedProfile() {
    if (user.id === null) return;
    setUser(await getProfileById(user.id))
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 */
export async function register(email, password) {
    try {
        
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            throw new Error(error.message);
        }

        setUser({
            id: data.user.id,
            email: data.user.email
        })

        await createUserProfile({
            id: user.id,
            email: user.email
        })
    } catch (error) {
        
    }
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 */
export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if(error){
        console.error(error)
    }

    setUser({
        id: data.user.id,
        email: data.user.email
    })

    loadExtendedProfile();
}

/**
 * 
 * @param {(user: {id: null|String, email: null|String}) => void} callback
 * @returns {() => void} 
 */
export function subscribeToAuthStateChanges(callback) {
    observers.push(callback);
    notify(callback);

    return () => {
        observers = observers.filter(obs => obs !== callback);
    }
}

export async function logout() {
    supabase.auth.signOut();

    setUser({
        id: null,
        email: null
    })
}

/**
 * 
 * @param {{bio?: String|null, display_name?: String|null, profession?: String|null}} data 
 */
export async function updateAuthUserData(data){
    try {
        await updateUserProfile(user.id, data);

        setUser(data);
    } catch (error) {
        
    }
}

/**
 * 
 * @param {user: {id: null|String, email: null|String}} callback 
 */
function notify(callback) {
    callback({...user})
}

/**
 * Notifica a todos los observers del estado actual del usuario.
 */
function notifyAll() {
    observers.forEach(notify);{}
}

/**
 * Actualiza el estado de autenticación y notifica a los observers.
 * 
 * @param {{id: null|String, email: null|String}} newData 
 */
function setUser(newData) {
    user = {
        ...user,
        ...newData
    }
    notifyAll();
}