import { orderBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import { UseMutateFunction, useMutation, useQueryClient } from 'react-query';
import { useProductsStore } from '../../store/home';
import { IntProduct } from '../../types/product';
import { ToastMessageTypeEnum } from '../../types/toastMessage';

interface UseProductProps {
  afterOnSuccess?: VoidFunction;
}

interface IntUseProduct {
  isDeleteProductLoading: boolean;
  isMutateProductLoading: boolean;
  mutateProduct: UseMutateFunction<IntProduct, unknown, () => Promise<IntProduct>, unknown>;
  mutateProductDelete: UseMutateFunction<IntProduct, unknown, () => Promise<IntProduct>, unknown>;
}

export const useProduct = ({ afterOnSuccess }: UseProductProps): IntUseProduct => {
  const { t } = useTranslation(['common', 'product']);
  const queryClient = useQueryClient();
  const { setToastMessage, filters, searchValue } = useProductsStore();

  const { mutate: mutateProduct, isLoading: isMutateProductLoading } = useMutation({
    mutationFn: async (fn: () => Promise<IntProduct>) => fn(),

    onSuccess: async (data) => {
      queryClient.setQueryData(
        ['products', filters, searchValue],
        (oldData: IntProduct[] | undefined) => {
          const existingProduct = oldData?.find((oldProduct) => oldProduct.id === data.id);

          let products;
          if (existingProduct) {
            products = (oldData ?? []).map((oldProduct: IntProduct) =>
              oldProduct.id === data.id ? data : oldProduct
            );
            setToastMessage({
              type: ToastMessageTypeEnum.SUCCESS,
              message: t('common:toast.updateProduct.success') ?? ''
            });
          } else {
            products = [...(oldData ?? []), data];
            setToastMessage({
              type: ToastMessageTypeEnum.SUCCESS,
              message: t('common:toast.createProduct.success') ?? ''
            });
          }

          return orderBy(products, ['updated_at'], ['desc']);
        }
      );
      afterOnSuccess && afterOnSuccess();
      await queryClient.invalidateQueries(['products', filters, searchValue], { exact: true });
    },

    onError: async (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.createProducts.error') ?? ''
      });
      await queryClient.invalidateQueries(['products'], { exact: true });
    }
  });

  const { mutate: mutateProductDelete, isLoading: isDeleteProductLoading } = useMutation({
    mutationFn: (deleteProduct: () => Promise<IntProduct>) => deleteProduct(),
    onSuccess: (data) => {
      queryClient.setQueryData(['products', filters], (oldData: IntProduct[] | undefined) => {
        if (!oldData) {
          return [];
        }
        return oldData?.filter((product) => product.id !== data.id);
      });

      setToastMessage({
        type: ToastMessageTypeEnum.SUCCESS,
        message: t('common:toast.deleteProduct.success') ?? ''
      });

      queryClient.invalidateQueries(['products', filters], { exact: true });
    },
    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.deleteProduct.error') ?? ''
      });

      queryClient.invalidateQueries(['products', filters], { exact: true });
    }
  });

  return { isDeleteProductLoading, isMutateProductLoading, mutateProduct, mutateProductDelete };
};
