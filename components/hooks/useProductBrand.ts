import { sortBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from 'react-query';
import { createProductBrand, fetchBrands } from '../../api/product';
import { useProductsStore } from '../../store/home';
import { ProductSelectFieldOptions } from '../../types/product';
import { ToastMessageTypeEnum } from '../../types/toastMessage';
import { useUser } from './useUser';

interface IntUseProductBrand {
  brands: ProductSelectFieldOptions[] | undefined;
  createBrand: UseMutateFunction<ProductSelectFieldOptions, unknown, string, unknown>;
}

export const useProductBrand = (): IntUseProductBrand => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { setToastMessage } = useProductsStore();

  const { data: brands }: { data: ProductSelectFieldOptions[] | undefined } = useQuery({
    queryKey: 'brands',
    queryFn: fetchBrands,
    staleTime: 1000 * 60 * 15,
    enabled: !!user,
    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.fetchBrands.error') ?? ''
      });
    }
  });

  const { mutate: createBrand } = useMutation({
    mutationFn: (newBrand: string) => createProductBrand(newBrand),
    onSuccess: async (data) => {
      queryClient.setQueryData('brands', (oldData: ProductSelectFieldOptions[] | undefined) => {
        return sortBy([...(oldData ?? []), data], 'name');
      });
      await queryClient.invalidateQueries(['brands'], {
        exact: true
      });
      setToastMessage({
        type: ToastMessageTypeEnum.SUCCESS,
        message: t('common:toast.createBrand.success') ?? ''
      });
    },
    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.createBrand.error') ?? ''
      });
    }
  });

  return { brands, createBrand };
};
