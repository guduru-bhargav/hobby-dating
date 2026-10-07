import { supabase } from "../lib/supabase";
import { AGE_BANDS } from "../lib/constants";
import { dobRangeForAges } from "../lib/utils";

const DECK_SIZE = 40;

// Profiles the viewer has already liked or passed on
export const fetchSwipedIds = async (meId) => {
  const { data, error } = await supabase
    .from("swipes")
    .select("to_user")
    .eq("from_user", meId);
  if (error) throw error;
  return new Set((data || []).map((r) => r.to_user));
};

// Builds the card deck: everyone in profiles, minus the viewer and anyone already swiped on,
// narrowed only by whatever the person turns on in the filter sheet. `myProfile` is the viewer's
// own profile row (used only to exclude it, not to auto-narrow by gender preference).
export const fetchDeck = async (myProfile, filters, swipedIds) => {
  let query = supabase
    .from("profiles")
    .select("*")
    .neq("user_id", myProfile.user_id)
    .order("created_at", { ascending: false })
    .limit(DECK_SIZE + swipedIds.size);

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
  return (data || []).filter((p) => !swipedIds.has(p.user_id)).slice(0, DECK_SIZE);
};

// Records a like or pass (upsert so re-swiping the same person is harmless)
export const recordSwipe = async (fromId, toId, action) => {
  const { error } = await supabase
    .from("swipes")
    .upsert(
      { from_user: fromId, to_user: toId, action },
      { onConflict: "from_user,to_user" }
    );
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
