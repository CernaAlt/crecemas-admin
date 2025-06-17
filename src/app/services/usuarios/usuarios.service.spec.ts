import { Usuario } from '../../interfaces/Usuario';
import { supabase } from '../../supabase/supabase-client';
import { UsuariosService } from './usuarios.service';

// Mock completo del cliente de Supabase
jest.mock('../../supabase/supabase-client', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signUp: jest.fn(),
    },
  },
}));

describe('UsuariosService', () => {
  let service: UsuariosService;

  beforeEach(() => {
    service = new UsuariosService();
    jest.clearAllMocks();
  });

  it('cargarUsuarios() debería obtener usuarios activos y actualizar el observable', async () => {
    const mockUsuarios: Usuario[] = [
      { auth_user_id: '1', nombre: 'Ana', estado: true } as Usuario,
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockResolvedValue({ data: mockUsuarios, error: null }),
    });

    await service.cargarUsuarios();

    service.usuarios$.subscribe((usuarios) => {
      expect(usuarios).toHaveLength(1);
      expect(usuarios[0].nombre).toBe('Ana');
    });
  });

  it('obtenerUsuarioPorId() debería devolver un usuario por su auth_user_id', async () => {
    const mockUsuario: Usuario = {
      auth_user_id: 'id123',
      nombre: 'Pedro',
      estado: true,
    } as Usuario;

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: mockUsuario, error: null }),
    });

    const usuario = await service.obtenerUsuarioPorId('id123');
    expect(usuario?.nombre).toBe('Pedro');
  });

  it('checkDniExists() debería devolver true si el DNI ya existe', async () => {
    const dni = '12345678';

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { dni }, error: null }),
    });

    const existe = await service.checkDniExists(dni);
    expect(existe).toBe(true);
  });

  it('crearUsuario() debería registrar usuario en auth y luego insertarlo en la tabla usuarios', async () => {
    const userData = {
      dni: '87654321',
      nombre: 'Mario',
      apellido: 'Gomez',
      fecha_nacimiento: new Date(),
      genero: 'M',
      telefono_movil: '999999999',
      ciudad: 'Cusco',
      pais: 'Perú',
      rol_id: '2',
    };

    (supabase.from as jest.Mock).mockImplementation((table) => {
      if (table === 'usuarios') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({ data: null, error: null }),
          insert: jest.fn().mockResolvedValue({ error: null }),
        };
      }
      return {};
    });

    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: { id: 'auth123' } },
      error: null,
    });

    const result = await service.crearUsuario('test@correo.com', 'password', userData);
    expect(result.data?.user?.id).toBe('auth123');
  });

  it('actualizarUsuario() debería modificar el usuario y actualizar la lista local', async () => {
    const original: Usuario = {
      auth_user_id: 'u1',
      nombre: 'Luis',
      estado: true,
    } as Usuario;

    const cambios = { nombre: 'Luis Modificado' };

    (service as any).usuariosSubject.next([original]);

    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { ...original, ...cambios }, error: null }),
    });

    const actualizado = await service.actualizarUsuario('u1', cambios);
    expect(actualizado.nombre).toBe('Luis Modificado');
  });

  it('eliminarUsuario() debería cambiar estado a false y eliminar de la lista local', async () => {
    const usuario: Usuario = {
      auth_user_id: 'u2',
      nombre: 'Carlos',
      estado: true,
    } as Usuario;

    (service as any).usuariosSubject.next([usuario]);

    (supabase.from as jest.Mock).mockReturnValue({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    });

    await service.eliminarUsuario('u2');

    service.usuarios$.subscribe((usuarios) => {
      expect(usuarios).toHaveLength(0);
    });
  });

  it('buscarUsuarios() debería encontrar coincidencias por nombre o correo', async () => {
    const resultadoEsperado: Usuario[] = [
      {
        auth_user_id: '1',
        nombre: 'María',
        email: 'maria@example.com',
        dni: '11111111',
      } as Usuario,
    ];

    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockResolvedValue({ data: resultadoEsperado, error: null }),
    });

    const encontrados = await service.buscarUsuarios('María');
    expect(encontrados).toHaveLength(1);
    expect(encontrados[0].nombre).toBe('María');
  });
});
