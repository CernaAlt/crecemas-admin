export interface Reservation {
  id: number;
  created_at: string;
  lastName: string;
  typeReason: string;
  detailReason: string;
  DNI: string;
  phone: string;
  atendido: boolean;
}