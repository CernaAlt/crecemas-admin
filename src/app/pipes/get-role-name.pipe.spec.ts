import { GetRoleNamePipe } from './get-role-name.pipe';

describe('GetRoleNamePipe', () => {
  it('create an instance', () => {
    const pipe = new GetRoleNamePipe();
    expect(pipe).toBeTruthy();
  });
});
