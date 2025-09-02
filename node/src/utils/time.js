export function ensureDate(val) {
  const d = new Date(val);
  if (isNaN(d.getTime())) throw new Error('Invalid date');
  return d;
}