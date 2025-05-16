import { Pipe, PipeTransform } from '@angular/core';
import { RolesService } from '../services/roles.service';

@Pipe({
  name: 'getRoleName',
  pure: false  // 👈 Esto permite que se actualice si cambia el valor.
})
export class GetRoleNamePipe implements PipeTransform {

  constructor(private rolesService: RolesService) {}

  // 👇 El transform recibe el ID del rol y devuelve el nombre.
  async transform(roleId: string): Promise<string> {
    if (!roleId) return 'Sin rol asignado';
    
    try {
      const role = await this.rolesService.getRoleById(roleId);
      return role?.nombre || 'Rol desconocido';
    } catch {
      return 'Error al cargar rol';
    }
  }
}
