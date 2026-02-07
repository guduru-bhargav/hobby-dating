import { supabase } from "../lib/supabase";

export const createProfile = async (profile) => {
  return await supabase.from("profiles").insert(profile);
};

export const getProfile = async (userId) => {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
};
