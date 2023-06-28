import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getUserData } from '../../api/user';
import { IntUser } from '../../types/auth';
import {
  deleteLocalStorageAuthToken,
  setLocalStorageAuthToken
} from '../../utils/localStorageAuthToken';

interface IntUseUser {
  user: IntUser | undefined;
  updateUser: (newUser: IntUser) => void;
  clearUser: () => void;
}

const useUserQueryEnabled = (): boolean => {
  const queryClient = useQueryClient();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (queryClient.getQueryData('user')) {
      setIsEnabled(false);
    }

    const token = localStorage.getItem('poAuthToken');
    if (token && !queryClient.getQueryData('user')) {
      setIsEnabled(true);
    }
  }, [queryClient]);

  return isEnabled;
};

export const useUser = (): IntUseUser => {
  const queryClient = useQueryClient();

  const isEnabled = useUserQueryEnabled();

  const { data: user }: { data: IntUser | undefined } = useQuery({
    queryKey: 'user',
    queryFn: () => getUserData(),
    enabled: isEnabled,
    staleTime: Infinity,
    onSuccess: (data: IntUser) => {
      if (isNil(data.token)) return;
      setLocalStorageAuthToken(data.token);
    },
    onError: (_err) => {
      deleteLocalStorageAuthToken();
    }
  });

  const updateUser = (newUser: IntUser): void => {
    queryClient.setQueryData('user', newUser);
  };

  const clearUser = (): void => {
    localStorage.removeItem('poAuthToken');
    queryClient.resetQueries('user');
  };

  return { user, updateUser, clearUser };
};
