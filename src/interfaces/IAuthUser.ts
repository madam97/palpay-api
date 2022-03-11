export default interface IAuthUser {
  id: number,
  name: string,
  role?: 'user' | 'admin'
};