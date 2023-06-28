import { IntUser, IntUserLoginData } from 'types/auth';
import { unprotectedApi } from './api';

export const signIn = async (userData: IntUserLoginData): Promise<IntUser> => {
  const { data } = await unprotectedApi.post('/api/auth/signin', userData);

  return data;
};
