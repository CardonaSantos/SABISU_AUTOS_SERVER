// utils/fechas.ts
export function dayBounds(dateISO: string, tz = '-06:00') {
  const day = dateISO.slice(0, 10);
  const inicio = new Date(`${day}T00:00:00${tz}`);
  const fin = new Date(`${day}T00:00:00${tz}`);
  fin.setDate(fin.getDate() + 1);
  return { inicio, fin, day };
}

export const n = (v: any) => Number(v ?? 0);
