import { supabase } from "../lib/supabase";

// Every profile row is keyed by the auth user's id in the `user_id` column
export const getProfileByUserId = async (userId) => {
  return await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
};

// Insert or update the caller's own profile (works for signup and the editor)
export const saveProfile = async (userId, fields) => {
  const { data: existing, error: lookupError } = await getProfileByUserId(userId);
  if (lookupError) throw lookupError;

  if (existing) {
    const { data, error } = await supabase
      .from("profiles")
      .update(fields)
      .eq("user_id", userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({ user_id: userId, ...fields })
    .select()
    .single();
  if (error) throw error;
  return data;
};
