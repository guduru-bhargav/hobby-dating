import { supabase } from "../lib/supabase";
import { AGE_BANDS } from "../lib/constants";
import { dobRangeForAges } from "../lib/utils";

const FEED_SIZE = 60;

// Everyone you've liked, so cards can show a filled heart without hiding anyone
export const fetchLikedIds = async (meId) => {
  const { data, error } = await supabase
    .from("swipes")
    .select("to_user")
    .eq("from_user", meId)
    .eq("action", "like");
  if (error) throw error;
  return new Set((data || []).map((r) => r.to_user));
};

// Everyone in profiles except the viewer, narrowed only by whatever the filter sheet turns on.
// Nobody is permanently removed from this list for having been liked or messaged before —
// it's a feed of suggestions, not a deck that empties out.
export const fetchProfiles = async (myProfile, filters) => {
  let query = supabase
    .from("profiles")
    .select("*")
    .neq("user_id", myProfile.user_id)
    .order("created_at", { ascending: false })
    .limit(FEED_SIZE);

  if (filters.gender.length) query = query.in("gender", filters.gender);
  if (filters.city.length) query = query.in("location_city", filters.city);

  if (filters.age.length) {
    const bands = AGE_BANDS.filter((b) => filters.age.includes(b.value));
    const clauses = bands.map((b) => {
      const { from, to } = dobRangeForAges(b.min, b.max);
      return `and(date_of_birth.gte.${from},date_of_birth.lte.${to})`;
    });
    query = query.or(clauses.join(","));
  }

  if (filters.hobbies.length) {
    query = query.or(filters.hobbies.map((h) => `hobbies.ilike.%${h}%`).join(","));
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

// Like a profile (upsert so liking twice is harmless)
export const likeProfile = async (fromId, toId) => {
  const { error } = await supabase
    .from("swipes")
    .upsert({ from_user: fromId, to_user: toId, action: "like" }, { onConflict: "from_user,to_user" });
  if (error) throw error;
};

// Undo a like
export const unlikeProfile = async (fromId, toId) => {
  const { error } = await supabase
    .from("swipes")
    .delete()
    .eq("from_user", fromId)
    .eq("to_user", toId)
    .eq("action", "like");
  if (error) throw error;
};

// True when the other person has already liked the viewer
export const hasLikedMe = async (meId, otherId) => {
  const { data, error } = await supabase
    .from("swipes")
    .select("id")
    .eq("from_user", otherId)
    .eq("to_user", meId)
    .eq("action", "like")
    .maybeSingle();
  if (error) throw error;
  return !!data;
};
