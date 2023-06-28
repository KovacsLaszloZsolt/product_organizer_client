import { i18n } from 'next-i18next';
import { UseQueryResult, useQuery } from 'react-query';
import { getProducts } from '../../api/product';
import { useProductsStore } from '../../store/home';
import { IntProduct } from '../../types/product';
import { ToastMessageTypeEnum } from '../../types/toastMessage';

interface UseProducts {
  productsQuery: UseQueryResult<IntProduct[] | undefined, unknown>;
}

export const useProducts = (): UseProducts => {
  const { searchValue, filters, setToastMessage } = useProductsStore();

  const productsQuery = useQuery({
    queryKey: ['products', filters, searchValue],
    queryFn: () => getProducts(filters, searchValue),
    staleTime: 1000 * 60 * 15,
    keepPreviousData: true,

    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: i18n?.t('common:toast.fetchProducts.error') ?? ''
      });
    }
  });

  return { productsQuery };
};
