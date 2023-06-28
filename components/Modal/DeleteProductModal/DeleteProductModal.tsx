import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { deleteProduct } from '../../../api/product';
import { useProduct } from '../../commonHooks/useProduct';

interface IntDeleteProductModalProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

export const DeleteProductModal = ({
  productId,
  productName,
  onClose
}: IntDeleteProductModalProps): JSX.Element => {
  const { t } = useTranslation();
  const { mutateProductDelete } = useProduct({ afterOnSuccess: onClose });

  const handleDeleteProduct = async (): Promise<void> => {
    mutateProductDelete(() => deleteProduct(productId));
  };

  return (
    <div>
      <Dialog open onClose={onClose} disableScrollLock fullWidth maxWidth="md">
        <DialogTitle>{t(`product:modal.deleteProduct.title`)}</DialogTitle>
        <DialogContent>
          {t(`product:modal.deleteProduct.description`, { productName })}
        </DialogContent>
        <DialogActions>
          <Button color="info" onClick={onClose}>
            {t('common:cancel')}
          </Button>
          <Button color="error" type="submit" onClick={handleDeleteProduct}>
            {t('common:delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
