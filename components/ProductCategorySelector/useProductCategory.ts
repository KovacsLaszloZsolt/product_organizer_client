import { sortBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from 'react-query';
import { createProductCategory, fetchCategories } from '../../api/product';
import { useProductsStore } from '../../store/home';
import { IntProductCategory } from '../../types/product';
import { ToastMessageTypeEnum } from '../../types/toastMessage';
import { useUser } from '../commonHooks/useUser';

interface UseProductCategory {
  categories: IntProductCategory[] | undefined;
  createCategoryMutation: UseMutateFunction<IntProductCategory, unknown, string, unknown>;
}

export const useProductCategory = (): UseProductCategory => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { setToastMessage } = useProductsStore();

  const { data: categories }: { data: IntProductCategory[] | undefined } = useQuery({
    queryKey: 'categories',
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 15,
    enabled: !!user,
    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.fetchCategories.error') ?? ''
      });
    }
  });

  const { mutate: createCategoryMutation } = useMutation({
    mutationFn: (newCategory: string) => createProductCategory(newCategory),
    onSuccess: async (data) => {
      queryClient.setQueryData('categories', (oldData: IntProductCategory[] | undefined) => {
        return sortBy([...(oldData ?? []), data], 'name');
      });
      await queryClient.invalidateQueries(['categories'], {
        exact: true
      });
      setToastMessage({
        type: ToastMessageTypeEnum.SUCCESS,
        message: t('common:toast.createCategory.success') ?? ''
      });
    },
    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.createCategory.error') ?? ''
      });
    }
  });

  return { categories, createCategoryMutation };
};
