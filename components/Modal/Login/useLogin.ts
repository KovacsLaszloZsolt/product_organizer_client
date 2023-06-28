import { useTranslation } from 'next-i18next';
import { Dispatch, SetStateAction } from 'react';
import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';
import { signIn } from '../../../api/auth';
import { IntUser, IntUserLoginData } from '../../../types/auth';
import { setLocalStorageAuthToken } from '../../../utils/localStorageAuthToken';

interface IntUseLoginProps {
  setError: Dispatch<SetStateAction<string | null>>;
  handleClose: () => void;
}

interface UseLogin {
  loginMutation: UseMutateFunction<IntUser, unknown, IntUserLoginData, unknown>;
}

export const useLogin = ({ setError, handleClose }: IntUseLoginProps): UseLogin => {
  const { t } = useTranslation(['common']);
  const queryClient = useQueryClient();
  const { mutate: loginMutation } = useMutation({
    mutationFn: (userLoginData: IntUserLoginData) => signIn(userLoginData),
    onSuccess: (data) => {
      queryClient.setQueryData('user', data);
      setLocalStorageAuthToken(data.token);
      handleClose();
    },
    onError: (_error) => {
      setError(t('common:toast.login.error'));
    }
  });

  return { loginMutation };
};
