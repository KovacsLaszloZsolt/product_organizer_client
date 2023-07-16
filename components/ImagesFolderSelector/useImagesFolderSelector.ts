import { sortBy } from 'lodash';
import { useTranslation } from 'next-i18next';
import { UseMutateFunction, useMutation, useQuery, useQueryClient } from 'react-query';
import { fetchImagesFolders, postImageFolder } from '../../api/product';
import { useProductsStore } from '../../store/home';
import { IntImagesFolder } from '../../types/product';
import { ToastMessageTypeEnum } from '../../types/toastMessage';
import { useUser } from '../hooks/useUser';

interface UseImagesFolderSelector {
  imagesFolders: IntImagesFolder[] | undefined;
  createImageFolder: UseMutateFunction<IntImagesFolder, unknown, string, unknown>;
}

export const useImagesFolderSelector = (): UseImagesFolderSelector => {
  const { t } = useTranslation('common');
  const queryClient = useQueryClient();
  const { user } = useUser();
  const { setToastMessage } = useProductsStore();

  const { data: imagesFolders }: { data: IntImagesFolder[] | undefined } = useQuery({
    queryKey: 'imagesFolders',
    queryFn: fetchImagesFolders,
    staleTime: Infinity,
    enabled: !!user,
    onError: (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.fetchImageFolders.error') ?? ''
      });
    }
  });

  const { mutate: createImageFolder } = useMutation({
    mutationFn: (imageFolderName: string) => postImageFolder(imageFolderName),

    onSuccess: async (data) => {
      queryClient.setQueryData(['imagesFolders'], (oldData: IntImagesFolder[] | undefined) => {
        return sortBy([...(oldData ?? []), data], 'name');
      });
      await queryClient.invalidateQueries(['imagesFolders'], { exact: true });

      setToastMessage({
        type: ToastMessageTypeEnum.SUCCESS,
        message: t('common:toast.createImagesFolder.success') ?? ''
      });
    },
    onError: async (_error) => {
      setToastMessage({
        type: ToastMessageTypeEnum.ERROR,
        message: t('common:toast.createImagesFolder.error') ?? ''
      });
      await queryClient.invalidateQueries(['imagesFolders'], { exact: true });
    }
  });

  return { imagesFolders, createImageFolder };
};
