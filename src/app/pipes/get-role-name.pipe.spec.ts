import { GetRoleNamePipe } from "./get-role-name.pipe";


describe('GetRoleNamePipe', () => {
  it('debería crear una instancia', () => {
    const pipe = new GetRoleNamePipe({} as any);
    expect(pipe).toBeTruthy();
  });
});

