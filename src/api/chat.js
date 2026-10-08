import { supabase } from "../lib/supabase";

// Profile fields that are safe to show next to a conversation or message
const PUBLIC_PROFILE_FIELDS = "user_id, first_name, photo_1, photo_2, location_city, date_of_birth, dating_intent";

// One conversation per pair of users. The DB has a unique index on the pair,
// so a race between two inserts resolves to a single row.
export const getOrCreateConversation = async (meId, otherId) => {
  const pairFilter = `and(user1.eq.${meId},user2.eq.${otherId}),and(user1.eq.${otherId},user2.eq.${meId})`;

  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("*")
    .or(pairFilter)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) return existing;

  const { data, error } = await supabase
    .from("conversations")
    .insert({ user1: meId, user2: otherId })
    .select()
    .single();

  if (error) {
    // 23505 = unique violation: the other side created it first, so fetch that row
    if (error.code === "23505") {
      const { data: again, error: againError } = await supabase
        .from("conversations")
        .select("*")
        .or(pairFilter)
        .single();
      if (againError) throw againError;
      return again;
    }
    throw error;
  }
  return data;
};

// Inbox rows: each conversation joined with the other person's profile
export const listConversations = async (meId) => {
  const { data: convos, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`user1.eq.${meId},user2.eq.${meId}`)
    .order("last_message_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!convos?.length) return [];

  const otherIds = convos.map((c) => (c.user1 === meId ? c.user2 : c.user1));
  const { data: profiles, error: profileError } = await supabase
    .from("profiles")
    .select(PUBLIC_PROFILE_FIELDS)
    .in("user_id", otherIds);
  if (profileError) throw profileError;

  return convos.map((c) => {
    const otherId = c.user1 === meId ? c.user2 : c.user1;
    return { ...c, otherId, profile: profiles?.find((p) => p.user_id === otherId) || null };
  });
};

export const fetchMessages = async (conversationId) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) throw error;
  return data || [];
};

export const sendMessage = async (conversationId, senderId, text) => {
  const { data, error } = await supabase
    .from("messages")
    .insert({ conversation_id: conversationId, sender_id: senderId, message: text })
    .select()
    .single();
  if (error) throw error;

  // Keep the inbox preview in sync. Failure here shouldn't hide a message that was sent —
  // but it's logged, since a silent failure here is exactly what makes the inbox look stuck
  // on "Say hi" even though messages exist.
  const { error: previewError } = await supabase
    .from("conversations")
    .update({ last_message: text, last_message_at: data.created_at })
    .eq("id", conversationId);
  if (previewError) console.warn("Couldn't update conversation preview:", previewError);

  return data;
};

export const markNotificationsRead = async (userId, conversationId) => {
  await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("conversation_id", conversationId)
    .eq("is_read", false);
};

export const countUnreadNotifications = async (userId) => {
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
  if (error) throw error;
  return count || 0;
};
