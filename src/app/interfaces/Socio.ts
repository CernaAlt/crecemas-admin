import { Usuario } from './Usuario'; // asegúrate de importar si están separados

export interface Socio {
  id: string;
  usuario_id: string;
  lugar_trabajo?: string;
  telefono_trabajo?: string;
  created_at?: string;

  usuario?: Usuario; // relación opcional (join con usuarios)
}
