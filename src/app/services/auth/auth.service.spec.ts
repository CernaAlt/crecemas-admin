import { AuthService } from './auth.service';
import { Router } from '@angular/router';
jest.mock('../../supabase/supabase-client', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      refreshSession: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(),
      eq: jest.fn(),
      insert: jest.fn(),
      single: jest.fn(),
    })),
  },
}));
import { supabase } from '../../supabase/supabase-client';
describe('AuthService', () => {
  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    router = {
      navigate: jest.fn(),
    } as unknown as Router;

    service = new AuthService(router);
  });
  describe('checkDniExists', () => {
    it('debe devolver true si el dni ya existe', async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest
          .fn()
          .mockResolvedValue({ data: { dni: '12345678' }, error: null }),
      });

      const exists = await service.checkDniExists('12345678');
      expect(exists).toBe(true);
    });

    it('debe devolver false si el dni no existe', async () => {
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: null }),
      });

      const exists = await service.checkDniExists('99999999');
      expect(exists).toBe(false);
    });
    
  });
});
