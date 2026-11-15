// Helpers shared by the dashboard components.
export const riel = (n) => Math.round(Number(n) || 0).toLocaleString("en-US");
export const usd = (n) => "$" + ((Number(n) || 0) / 4000).toFixed(2) + " USD";

export const saleUnit = (s) =>
  s.unitPrice || s.currentPriceRiel || s.price?.priceRiel || 0;
export const saleTotal = (s) =>
  s.total ?? s.totalPrice ?? saleUnit(s) * s.quantity;

// Local calendar date as YYYY-MM-DD. toISOString() gives the UTC date, which is
// still "yesterday" in Cambodia between 00:00 and 07:00.
export const localDate = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const todayStr = () => localDate();
export const shiftDate = (ymd, days) => {
  const d = new Date(`${ymd}T00:00:00`);
  d.setDate(d.getDate() + days);
  return localDate(d);
};
// dd/mm/yyyy, as in the original design (08/11/2026)
export const displayDate = (ymd) => ymd.split("-").reverse().join("/");
