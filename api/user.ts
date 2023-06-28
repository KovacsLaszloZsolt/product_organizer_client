import { IntUser } from '../types/auth';
import { api } from './api';

export const getUserData = async (): Promise<IntUser> => {
  const { data } = await api.get('/api/user/me');

  return data;
};
