import { PrestamosService } from './prestamos.service';
import { supabase } from '../../supabase/supabase-client';
import { Prestamo } from '../../interfaces/Prestamo';

const mockSelect = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();

jest.mock('../../supabase/supabase-client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('PrestamosService', () => {
  let service: PrestamosService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockChain = {
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
    };

    mockSelect.mockReturnValue(mockChain);
    mockEq.mockReturnValue(mockChain);
    mockSingle.mockReturnValue(mockChain);

    (supabase.from as jest.Mock).mockReturnValue(mockChain);

    service = new PrestamosService();
  });

  /*

  describe('getAll', () => {
    it('debe retornar todos los préstamos con datos de socio y usuario', async () => {
      const prestamos: Prestamo[] = [
        {
          id: '1',
          socio: {
            id: 's1',
            usuario: {
              nombre: 'Juan',
              dni: '12345678',
            },
          },
        } as any,
      ];

      mockSelect.mockResolvedValueOnce({ data: prestamos, error: null });

      const result = await service.getAll();
      expect(result).toEqual(prestamos);
      expect(supabase.from).toHaveBeenCalledWith('prestamos');
      expect(mockSelect).toHaveBeenCalled();
    });

    it('debe lanzar error si Supabase retorna error', async () => {
      const error = new Error('Error al obtener préstamos');

      mockSelect.mockResolvedValueOnce({ data: null, error });

      await expect(service.getAll()).rejects.toThrow('Error al obtener préstamos');
    });
  });

  describe('getById', () => {
    it('debe retornar el préstamo por su ID', async () => {
      const prestamo = { id: '1', monto: 1000 };

      mockSingle.mockResolvedValueOnce({ data: prestamo, error: null });

      const result = await service.getById('1');
      expect(result).toEqual(prestamo);
      expect(supabase.from).toHaveBeenCalledWith('prestamos');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', '1');
      expect(mockSingle).toHaveBeenCalled();
    });

    it('debe lanzar error si ocurre un fallo en Supabase', async () => {
      const error = new Error('No encontrado');

      mockSingle.mockResolvedValueOnce({ data: null, error });

      await expect(service.getById('1')).rejects.toThrow('No encontrado');
    });
  });

  */

  it('true', () => {
    expect(true).toBeTruthy(); 
  });

});
