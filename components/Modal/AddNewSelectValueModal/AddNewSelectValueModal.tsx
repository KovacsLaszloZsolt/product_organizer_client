import { Alert, Button, Dialog, DialogActions, DialogTitle, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import * as Yup from 'yup';
import * as S from './AddNewSelectValueModal.style';

interface AddNewSelectValueModalProps {
  name: string;
  onSubmit: (name: string) => void;
}

export const AddNewSelectValueModal = ({
  name,
  onSubmit
}: AddNewSelectValueModalProps): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = (): void => {
    setIsOpen(false);
    setError(null);
    resetForm();
  };

  const { values, errors, touched, handleSubmit, handleBlur, resetForm, handleChange } = useFormik({
    initialValues: {
      name: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t('common:error.isRequired', { field: name }) ?? '')
    }),
    onSubmit: (values) => {
      onSubmit(values.name);
      handleClose();
    }
  });

  return (
    <>
      <S.TextButton
        variant="text"
        onClick={(): void => {
          setIsOpen(true);
        }}
      >
        {t('product:createNew', {
          name: name
        })}
      </S.TextButton>
      <Dialog
        open={isOpen}
        onClose={(): void => {
          setIsOpen(false);
        }}
        disableScrollLock
      >
        {error && <Alert severity="error">{error}</Alert>}
        <DialogTitle>{t('product:createNew', { name })}</DialogTitle>
        <S.CustomDialogContent>
          <form noValidate>
            <TextField
              id="name"
              name="name"
              type="text"
              label={name}
              size="small"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              error={!!(touched.name && errors.name)}
              helperText={touched.name && errors.name}
              required
            />
          </form>
        </S.CustomDialogContent>
        <DialogActions>
          <Button color="error" onClick={handleClose}>
            {t('common:cancel')}
          </Button>
          <Button
            type="submit"
            onClick={(): void => {
              handleSubmit();
            }}
          >
            {t('common:create')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
