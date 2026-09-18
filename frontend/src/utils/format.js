/** Indian digit grouping: 1234567 -> "12,34,567" */
export function groupINR(value) {
  const n = Math.round(Math.abs(Number(value) || 0));
  const s = String(n);
  if (s.length <= 3) return s;
  const tail = s.slice(-3);
  let head = s.slice(0, -3);
  const groups = [];
  while (head.length > 2) {
    groups.unshift(head.slice(-2));
    head = head.slice(0, -2);
  }
  if (head) groups.unshift(head);
  return [...groups, tail].join(",");
}

export function formatINR(value) {
  if (value === null || value === undefined || value === "" || Number.isNaN(Number(value))) return "";
  const sign = Number(value) < 0 ? "-" : "";
  return `${sign}₹${groupINR(value)}`;
}

/** Compact form for axis labels: 1250000 -> "₹12.5L" */
export function shortINR(value) {
  const n = Number(value) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(n >= 1000000 ? 0 : 1)}L`;
  if (n >= 1000) return `₹${Math.round(n / 1000)}k`;
  return `₹${n}`;
}

export const pct = (value, digits = 1) =>
  value === null || value === undefined ? "—" : `${Number(value).toFixed(digits)}%`;

export function ordinal(n) {
  const i = Math.round(n);
  const suffix = i % 100 >= 11 && i % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][i % 10] || "th";
  return `${i}${suffix}`;
}
