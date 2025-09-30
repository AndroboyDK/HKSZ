export const isNonEmpty = (s) => typeof s === 'string' && s.trim().length >= 2;
export const isAddress = (s) => typeof s === 'string' && s.trim().length >= 5 && s.trim().length <= 120;
export const toNumberSafe = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};
export const isLat = (n) => typeof n === 'number' && n >= -90 && n <= 90;
export const isLng = (n) => typeof n === 'number' && n >= -180 && n <= 180;
export const isPrice = (n) => typeof n === 'number' && n >= 0;
