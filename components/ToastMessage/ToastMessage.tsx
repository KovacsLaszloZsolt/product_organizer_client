// import * as S from './Error.styles';

import { Alert, Portal, Snackbar } from '@mui/material';
import { useProductsStore } from '../../store/home';

export const ToastMessage = (): JSX.Element => {
  const { toastMessage, setToastMessage } = useProductsStore();

  const handleClose = (): void => {
    setToastMessage(null);
  };
  return (
    <Portal>
      <Snackbar
        open={!!toastMessage}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity={toastMessage?.type} sx={{ width: '100%' }}>
          {toastMessage?.message}
        </Alert>
      </Snackbar>
    </Portal>
  );
};
