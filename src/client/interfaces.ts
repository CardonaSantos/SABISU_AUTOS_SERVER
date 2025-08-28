type ISODateString = string;

export interface ClienteToSelect {
  id: number;
  nombre: string;
  apellidos: string | null;
  observaciones: string | null;
  telefono: string | null;
  creadoEn: Date; // dates serializados por el API
  actualizadoEn: Date; // (si lo usas en frontend)
}
