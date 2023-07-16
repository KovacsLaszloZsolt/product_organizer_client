import { sortBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from 'react-query';
import { createProductOwner as createPoOwner, fetchProductOwners } from '../../api/product';
import { useProductsStore } from '../../store/home';
import { IntProductOwner } from '../../types/product';
import { ToastMessageTypeEnum } from '../../types/toastMessage';
import { useUser } from './useUser';

interface UseProductOwner {
  productOwners: IntProductOwner[] | undefined;
  createProductOwner: UseMutateFunction<IntProductOwner, unknown, string, unknown>;
}

export const useProductOwner = (): UseProductOwner => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { setToastMessage } = useProductsStore();

  const { data: productOwners }: { data: IntProductOwner[] | undefined } = useQuery({
    queryKey: 'productOwners',
    queryFn: fetchProductOwners,
    staleTime: Infinity,
    enabled: !!user,
    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.fetchProductOwners.error') ?? ''
      });
    }
  });

  const { mutate: createProductOwner } = useMutation({
    mutationFn: (productOwner: string) => createPoOwner(productOwner),

    onSuccess: async (data) => {
      queryClient.setQueryData(['productOwners'], (oldData: IntProductOwner[] | undefined) => {
        return sortBy([...(oldData ?? []), data], 'name');
      });
      await queryClient.invalidateQueries(['productOwners'], { exact: true });

      setToastMessage({
        type: ToastMessageTypeEnum.SUCCESS,
        message: t('common:toast.createProductOwner.success') ?? ''
      });
    },
    onError: async (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.createProductOwner.error') ?? ''
      });
      await queryClient.invalidateQueries(['productOwners'], { exact: true });
    }
  });

  return { productOwners, createProductOwner };
};
