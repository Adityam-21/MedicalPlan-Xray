export const STATE_TIER_OPTIONS = [
  { value: "Tier-1", label: "Tier-1 — major metros" },
  { value: "Tier-2", label: "Tier-2 — large cities" },
  { value: "Tier-3", label: "Tier-3 — smaller cities and towns" },
];

// Shown as helper text. The dataset does not define these tiers, so these are
// the commonly used Indian city groupings, given only as a guide.
export const STATE_TIER_HELP =
  "Guide only: Tier-1 — Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad. " +
  "Tier-2 — Jaipur, Lucknow, Indore, Nagpur, Kochi, Coimbatore, Chandigarh, Bhopal. " +
  "Tier-3 — smaller cities and district towns.";

export const OCCUPATION_OPTIONS = [
  { value: "Low-Risk", label: "Low-Risk — desk or office work" },
  { value: "Medium-Risk", label: "Medium-Risk — field work, driving, retail" },
  { value: "High-Risk", label: "High-Risk — construction, mining, heavy machinery" },
];

export const OCCUPATION_HELP =
  "The dataset labels occupations only as Low, Medium or High risk; the examples are a guide.";

export const SMOKER_OPTIONS = [
  { value: 0, label: "No" },
  { value: 1, label: "Yes" },
];

// Example profiles, so the form can be filled in one click.
export const PRESETS = [
  {
    name: "Young professional",
    values: {
      age: 26, state_tier: "Tier-1", occupation_class: "Low-Risk",
      total_income_inr: 900000, annual_expenditure_inr: 48000,
      is_smoker: 0, family_members: 2,
    },
  },
  {
    name: "Family of four",
    values: {
      age: 45, state_tier: "Tier-2", occupation_class: "Medium-Risk",
      total_income_inr: 700000, annual_expenditure_inr: 135000,
      is_smoker: 0, family_members: 4,
    },
  },
  {
    name: "Older smoker",
    values: {
      age: 67, state_tier: "Tier-1", occupation_class: "High-Risk",
      total_income_inr: 1200000, annual_expenditure_inr: 250000,
      is_smoker: 1, family_members: 5,
    },
  },
];

// Ranges the model was trained on (backend/app/features.py TRAINING_RANGES).
export const TRAINING_RANGES = {
  age: [18, 75],
  family_members: [1, 6],
  total_income_inr: [151934, 4997509],
  annual_expenditure_inr: [5000, 416505],
};
