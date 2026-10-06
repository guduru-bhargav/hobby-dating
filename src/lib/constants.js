// Shared option lists. Values are stored in Supabase, so keep them stable.

export const GENDERS = [
  { value: "male", label: "Man" },
  { value: "female", label: "Woman" },
  { value: "non-binary", label: "Non-binary" },
];

export const GENDER_PREFERENCES = [
  { value: "male", label: "Men" },
  { value: "female", label: "Women" },
  { value: "everyone", label: "Everyone" },
];

export const DATING_INTENTS = [
  { value: "friendship", label: "Friendship" },
  { value: "casual", label: "Casual dating" },
  { value: "serious", label: "Serious relationship" },
];

export const HOBBIES = [
  "Music",
  "Travel",
  "Gaming",
  "Sports",
  "Photography",
  "Cooking",
  "Reading",
  "Hiking",
  "Movies",
  "Art",
  "Fitness",
  "Dancing",
];

export const CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune"];

export const AGE_BANDS = [
  { value: "18-25", min: 18, max: 25 },
  { value: "26-35", min: 26, max: 35 },
  { value: "36-45", min: 36, max: 45 },
  { value: "46+", min: 46, max: 120 },
];

export const MIN_AGE = 18;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
