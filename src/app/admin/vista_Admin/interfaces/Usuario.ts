export interface Usuario {
  id: string;
  auth_user_id: string;
  dni: string;
  email: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: Date; // ISO string (yyyy-MM-dd)
  genero: string;
  telefono_movil: string;
  ciudad: string;
  pais: string;
  fecha_ingreso: Date; // ISO string (yyyy-MM-dd)
  rol_id: string;
  created_at?: Date; // ISO string (yyyy-MM-dd)
}
