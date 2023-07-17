import { isEmpty } from 'lodash';
import { i18n } from 'next-i18next';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery
} from 'react-query';
import { getProducts } from '../../api/product';
import { useProductsStore } from '../../store/home';
import { IntProduct } from '../../types/product';
import { ToastMessageTypeEnum } from '../../types/toastMessage';

interface UseProducts {
  data: InfiniteData<IntProduct[]> | undefined;
  hasNextPage?: boolean;
  isFetching: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions | undefined
  ) => Promise<InfiniteQueryObserverResult<unknown, unknown>>;
}

export const useProducts = (): UseProducts => {
  const { searchValue, filters, setToastMessage } = useProductsStore();

  const { data, hasNextPage, isFetching, fetchNextPage } = useInfiniteQuery<IntProduct[], Error>({
    queryKey: ['products', filters, searchValue],
    getNextPageParam: (lastPage, allPages) => {
      if (isEmpty(lastPage)) return undefined;

      return allPages.length + 1;
    },
    queryFn: ({ pageParam = 1 }) => getProducts(filters, searchValue, pageParam),
    staleTime: 1000 * 60 * 15,
    keepPreviousData: true,

    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: i18n?.t('common:toast.fetchProducts.error') ?? ''
      });
    }
  });

  return { data, hasNextPage, isFetching, fetchNextPage };
};
