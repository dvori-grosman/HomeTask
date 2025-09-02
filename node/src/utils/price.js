// Business rules:
// Time estimate (minutes): 30 base + 10 * dirtLevel + extras: +15 for פוליש, +10 for ווקס
// Price (₪): 50 base + 20 * dirtLevel + 2 * distanceKm

export function calcTimeEstimateMinutes(serviceType, dirtLevel) {
  let minutes = 30 + 10 * Number(dirtLevel || 0);
  if (serviceType === 'פוליש') minutes += 15;
  if (serviceType === 'ווקס') minutes += 10;
  return minutes;
}

export function calcPriceNis(dirtLevel, distanceKm) {
  const price = 50 + 20 * Number(dirtLevel || 0) + 2 * Number(distanceKm || 0);
  return Math.max(0, Math.round(price));
}