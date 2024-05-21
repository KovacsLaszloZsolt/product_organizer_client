import { i18n } from 'next-i18next';
import { useQuery } from 'react-query';
import { getNumberOfProducts } from '../../api/product';
import { useProductsStore } from '../../store/home';
import { ToastMessageTypeEnum } from '../../types/toastMessage';

interface useProductsCountProps {
  numberOfProducts: number | undefined;
}

export const useProductsCount = (): useProductsCountProps => {
  const { searchValue, filters, setToastMessage } = useProductsStore();

  const { data: numberOfProducts } = useQuery<number, Error>({
    queryKey: ['productsCount', filters, searchValue],
    queryFn: () => getNumberOfProducts(filters, searchValue),
    staleTime: 1000 * 60 * 15,

    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: i18n?.t('common:toast.fetchProducts.error') ?? ''
      });
    }
  });

  return { numberOfProducts };
};
