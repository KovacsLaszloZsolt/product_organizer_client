import { flatten } from 'lodash';
import { useTranslation } from 'next-i18next';
import { InfiniteData, UseMutateFunction, useMutation, useQueryClient } from 'react-query';
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

    onSuccess: (data) => {
      queryClient.setQueryData<InfiniteData<IntProduct[]> | undefined>(
        ['products', filters, searchValue],
        (oldData) => {
          const existingProduct =
            (flatten(oldData?.pages ?? []).find(
              (oldProduct) => (oldProduct as IntProduct).id === data.id
            ) as IntProduct) || undefined;

          const products = (oldData?.pages ?? []).map((page, pageIndex) =>
            (page as IntProduct[]).reduce((acc, curr, index) => {
              if (existingProduct && pageIndex === 0 && index === 0) {
                acc.push(existingProduct);
              }

              if (!existingProduct || curr.id !== existingProduct.id) {
                acc.push(curr);
              }

              return acc;
            }, [] as IntProduct[])
          );

          if (existingProduct) {
            setToastMessage({
              type: ToastMessageTypeEnum.SUCCESS,
              message: t('common:toast.updateProduct.success') ?? ''
            });
          } else {
            setToastMessage({
              type: ToastMessageTypeEnum.SUCCESS,
              message: t('common:toast.createProduct.success') ?? ''
            });
          }

          return { pages: products, pageParams: oldData?.pageParams ?? [] };
        }
      );
      afterOnSuccess && afterOnSuccess();
      queryClient.invalidateQueries(['products', filters, searchValue], { exact: true });
      queryClient.invalidateQueries(['productsCount']);
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
      queryClient.setQueryData<InfiniteData<IntProduct[]> | undefined>(
        ['products', filters, searchValue],
        (oldData) => {
          return {
            pages:
              oldData?.pages.map((page) => page?.filter((product) => product.id !== data.id)) ?? [],
            pageParams: oldData?.pageParams ?? []
          };
        }
      );

      setToastMessage({
        type: ToastMessageTypeEnum.SUCCESS,
        message: t('common:toast.deleteProduct.success') ?? ''
      });

      queryClient.invalidateQueries(['products', filters, searchValue], { exact: true });
      queryClient.invalidateQueries(['productsCount']);
    },
    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.deleteProduct.error') ?? ''
      });

      queryClient.invalidateQueries(['products', filters, searchValue], { exact: true });
    }
  });

  return { isDeleteProductLoading, isMutateProductLoading, mutateProduct, mutateProductDelete };
};
