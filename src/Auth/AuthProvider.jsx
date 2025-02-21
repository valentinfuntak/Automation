import { createContext, createSignal, useContext, Show } from "solid-js";
import { supabase } from "../Supabase/Supabase.js";

const url = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;

// context
const AuthContext = createContext();

// helper
export function useAuth() {
    return useContext(AuthContext);
}

// component
export function AuthProvider(props) {
    const [session, setSession] = createSignal(null);
    const [loading, setLoading] = createSignal(true);

    supabase.auth.onAuthStateChange((event, session) => {
        //console.log(event, session);
        //console.log(apiKey, url);

        if (event === "SIGNED_IN" || event === "USER_UPDATED") {
            setSession(session);
            setLoading(false);
        } else if (event === "SIGNED_OUT") {
            setSession(null);
            setLoading(false);
        } else if (event === "INITIAL_SESSION") {
            setLoading(false);
        }
    });

    return (
        <Show when={!loading()}>
            <AuthContext.Provider value={session}>{props.children}</AuthContext.Provider>
        </Show>
    );
}