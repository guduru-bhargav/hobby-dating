import { supabase } from "./supabase";
import { MAX_PHOTO_BYTES } from "./constants";

// Age in whole years from a yyyy-mm-dd string
export const calculateAge = (dob) => {
  if (!dob) return null;
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
};

// Earliest / latest date of birth for an age range (used by filters)
export const dobRangeForAges = (minAge, maxAge) => {
  const today = new Date();
  const latest = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
  const earliest = new Date(today.getFullYear() - maxAge - 1, today.getMonth(), today.getDate() + 1);
  const iso = (d) => d.toISOString().slice(0, 10);
  return { from: iso(earliest), to: iso(latest) };
};

// hobbies is stored as a comma-separated string, but older rows may hold an array
export const parseHobbies = (hobbies) => {
  if (Array.isArray(hobbies)) return hobbies.map((h) => String(h).trim()).filter(Boolean);
  return String(hobbies || "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);
};

export const joinHobbies = (list) => list.join(", ");

export const timeAgo = (iso) => {
  if (!iso) return "";
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

export const clockTime = (iso) =>
  iso ? new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "";

export const FALLBACK_AVATAR = (seed = "user") =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(seed)}&backgroundColor=ffd5dc,ffe3c2,f5d0fe`;

export const photoOf = (profile, which = 1) => {
  const url = which === 2 ? profile?.photo_2 || profile?.photo_1 : profile?.photo_1 || profile?.photo_2;
  return url || FALLBACK_AVATAR(profile?.first_name || "user");
};

// Check a picked file before uploading it
export const validatePhoto = (file) => {
  if (!file) return "Please choose a photo";
  if (!file.type.startsWith("image/")) return "Photos must be image files";
  if (file.size > MAX_PHOTO_BYTES) return "Photos must be 5 MB or smaller";
  return null;
};

// Uploads to the public "profiles" bucket under the user's own folder
export const uploadPhoto = async (userId, file, slot) => {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `${userId}/${slot}_${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("profiles").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from("profiles").getPublicUrl(path).data.publicUrl;
};

export const errorMessage = (err, fallback = "Something went wrong. Please try again.") =>
  err?.message || fallback;
