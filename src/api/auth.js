import { supabase } from "../lib/supabase";

export const signup = async (email, password, metadata) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
};

export const login = async (email, password) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const logout = async () => {
  return await supabase.auth.signOut();
};
