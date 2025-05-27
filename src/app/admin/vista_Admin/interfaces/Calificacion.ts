import { Usuario } from "./Usuario";

export interface Calificacion {
  id?: string;
  usuario_id: string;
  puntuacion: number; // 1 a 5
  comentario?: string;
  servicio: string;   // 🆕 nuevo campo
  created_at?: string;

  usuario?: Usuario
}
