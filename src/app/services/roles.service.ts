import { Injectable } from '@angular/core';
import { supabase } from '../supabase/supabase-client';
import { Observable } from 'rxjs';



@Injectable({
    providedIn: 'root',
})
export class RolesService {
    constructor() { }

    // Obtener todos los roles
    async getAllRoles() {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('nombre', { ascending: true });

        if (error) throw error;
        return data;
    }

    // Obtener el ID del rol por defecto (cliente)
    async getDefaultRoleId() {
        const { data, error } = await supabase
            .from('roles')
            .select('id')
            .eq('nombre', 'cliente')
            .single();

        if (error) throw error;
        return data.id;
    }

    // ✅ Obtener un rol por ID
    async getRoleById(roleId: string) {
        // Verificamos si se recibió un ID
        if (!roleId) {
            throw new Error("El ID del rol es requerido");
        }

        // Consulta a Supabase para obtener el rol
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .eq('id', roleId)
            .single(); // 👈 Esto asegura que solo devuelva un único registro

        if (error) throw error;

        return data; // Devuelve el rol encontrado
    }
}