import { Reservation } from '../../interfaces/Reservation';
import { supabase } from '../../supabase/supabase-client';
import { ReservasService } from './reservas.service';


const mockSelect = jest.fn();
const mockEq = jest.fn();

jest.mock('../../supabase/supabase-client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('ReservasService', () => {
  let service: ReservasService;

  beforeEach(() => {
    jest.clearAllMocks();

    const mockChain = {
      select: mockSelect,
      eq: mockEq,
    };

    mockSelect.mockReturnValue(mockChain);
    mockEq.mockReturnValue(mockChain);

    (supabase.from as jest.Mock).mockReturnValue(mockChain);

    service = new ReservasService();
  });

  describe('getReservasPorDni', () => {
    it('debe retornar las reservas asociadas al DNI', async () => {
      const mockReservas: Reservation[] = [
        { id: '1', DNI: '12345678', fecha: '2024-01-01' },
      ] as any;

      mockEq.mockResolvedValueOnce({ data: mockReservas, error: null });

      const result = await service.getReservasPorDni('12345678');
      expect(result).toEqual(mockReservas);
      expect(supabase.from).toHaveBeenCalledWith('ReservasCreditos');
      expect(mockSelect).toHaveBeenCalledWith('*');
      expect(mockEq).toHaveBeenCalledWith('DNI', '12345678');
    });

    it('debe lanzar error si ocurre un problema con Supabase', async () => {
      const error = new Error('Consulta fallida');
      mockEq.mockResolvedValueOnce({ data: null, error });

      await expect(service.getReservasPorDni('12345678')).rejects.toThrow('Consulta fallida');
    });
  });
});
