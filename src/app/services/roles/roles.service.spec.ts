import { supabase } from '../../supabase/supabase-client';
import { RolesService } from './roles.service';

const mockSelect = jest.fn();
const mockOrder = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();

// IMPORTANTE: La ruta del mock debe coincidir EXACTAMENTE con la importación
// Si tu archivo está en src/app/services/roles/ y supabase-client está en src/app/supabase/
// entonces la ruta relativa es ../../supabase/supabase-client
jest.mock('../../supabase/supabase-client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('RolesService', () => {
  let service: RolesService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Resetear los mocks
    mockSelect.mockClear();
    mockOrder.mockClear();
    mockEq.mockClear();
    mockSingle.mockClear();

    // Configuración de la cadena .from('roles').select(...).order(...)
    const mockChain = {
      select: mockSelect,
      order: mockOrder,
      eq: mockEq,
      single: mockSingle,
    };

    // Cada método retorna el objeto para permitir el chaining
    mockSelect.mockReturnValue(mockChain);
    mockOrder.mockReturnValue(mockChain);
    mockEq.mockReturnValue(mockChain);

    (supabase.from as jest.Mock).mockReturnValue(mockChain);

    service = new RolesService();
  });

  describe('getAllRoles', () => {
    it('debe retornar todos los roles cuando rolesMap está vacío', async () => {
      const rolesData = [
        { id: '1', nombre: 'Administrador' },
        { id: '2', nombre: 'Cliente' },
      ];

      // Mock para initializeRoles (llamado internamente)
      mockOrder.mockResolvedValueOnce({
        data: rolesData,
        error: null,
      });

      const roles = await service.getAllRoles();

      expect(roles).toEqual(rolesData);
      expect(supabase.from).toHaveBeenCalledWith('roles');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockOrder).toHaveBeenCalled();
    });

    it('debe manejar errores de Supabase y retornar array vacío', async () => {
      const error = new Error('Database error');
      
      mockOrder.mockResolvedValueOnce({
        data: null,
        error: error,
      });

      // El servicio captura el error y retorna un array vacío
      const roles = await service.getAllRoles();
      expect(roles).toEqual([]);
    });
  });

  describe('getRoleNameById', () => {
    it('debe devolver el nombre del rol por ID', () => {
      service['rolesMap'].set('1', 'Administrador');
      const roleName = service.getRoleNameById('1');
      expect(roleName).toBe('Administrador');
    });

    it('debe devolver "Desconocido" si el rol no existe', () => {
      const roleName = service.getRoleNameById('999');
      expect(roleName).toBe('Desconocido');
    });
  });

  describe('getRoleIdByName', () => {
    it('debe devolver el ID del rol por nombre', () => {
      service['rolesMap'].set('1', 'Administrador');
      const roleId = service.getRoleIdByName('Administrador');
      expect(roleId).toBe('1');
    });

    it('debe devolver undefined si el nombre no existe', () => {
      const roleId = service.getRoleIdByName('Desconocido');
      expect(roleId).toBeUndefined();
    });
  });

  describe('getDefaultRoleId', () => {
    it('debe devolver el ID del rol cliente', async () => {
      mockSingle.mockResolvedValueOnce({ 
        data: { id: '2' }, 
        error: null 
      });

      const defaultId = await service.getDefaultRoleId();
      
      expect(defaultId).toBe('2');
      expect(supabase.from).toHaveBeenCalledWith('roles');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
    });

    it('debe manejar errores y retornar undefined', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: new Error('Not found')
      });

      // El servicio captura el error y retorna undefined
      const defaultId = await service.getDefaultRoleId();
      expect(defaultId).toBeUndefined();
    });
  });

  describe('getRoleById', () => {
    it('debe lanzar error si el ID es vacío', async () => {
      await expect(service.getRoleById('')).rejects.toThrow('El ID del rol es requerido');
    });

    it('debe devolver el rol por su ID', async () => {
      const role = { id: '1', nombre: 'Admin' };
      
      mockSingle.mockResolvedValueOnce({ 
        data: role, 
        error: null 
      });

      const result = await service.getRoleById('1');
      
      expect(result).toEqual(role);
      expect(supabase.from).toHaveBeenCalledWith('roles');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
    });

    it('debe manejar errores y retornar undefined', async () => {
      mockSingle.mockResolvedValueOnce({
        data: null,
        error: new Error('Not found')
      });

      // El servicio captura el error y retorna undefined
      const result = await service.getRoleById('999');
      expect(result).toBeUndefined();
    });
  });
});