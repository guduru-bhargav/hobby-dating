// Discover filter state. Every key holds a list of selected values.
export const EMPTY_FILTERS = { age: [], city: [], gender: [], hobbies: [] };

export const countActiveFilters = (filters) =>
  Object.values(filters).reduce((n, list) => n + list.length, 0);
