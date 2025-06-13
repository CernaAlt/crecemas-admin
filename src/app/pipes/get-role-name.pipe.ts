import { Pipe, PipeTransform } from '@angular/core';
import { RolesService } from '../services/roles/roles.service';
import { BehaviorSubject } from 'rxjs';

@Pipe({
  name: 'getRoleName',
  pure: false  // 👈 Esto permite que se actualice si cambia el valor.
})
export class GetRoleNamePipe implements PipeTransform {

  private cache = new Map<string, BehaviorSubject<string>>();

  constructor(private rolesService: RolesService) {}

  transform(roleId: string): string {
    if (!roleId) return 'Sin rol asignado';

    // Si ya existe en el cache, devolvemos el valor
    if (this.cache.has(roleId)) {
      return this.cache.get(roleId)!.value;
    }

    // Si no existe, creamos el observable y lo añadimos al cache
    const roleSubject = new BehaviorSubject<string>('Cargando...');
    this.cache.set(roleId, roleSubject);

    // Realizamos la petición y actualizamos el valor
    this.rolesService.getRoleById(roleId).then((role) => {
      roleSubject.next(role?.nombre || 'Rol desconocido');
    }).catch(() => {
      roleSubject.next('Error al cargar rol');
    });

    // Devolvemos el valor actual mientras carga
    return roleSubject.value;
  }
}
