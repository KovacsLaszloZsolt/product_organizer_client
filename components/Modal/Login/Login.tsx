import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { MouseEvent, useState } from 'react';
import * as Yup from 'yup';
import * as S from './Login.styles';
import { useLogin } from './useLogin';
import { modalOnCloseHandler } from '../../../utils/modalOnCloseHandler';

export const Login = (): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = (): void => {
    setIsOpen(false);
    setError(null);
    resetForm();
  };

  const { loginMutation } = useLogin({ setError, handleClose });

  const { values, errors, touched, handleSubmit, handleChange, handleBlur, resetForm } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t('common:error.emailIsInvalid') ?? '')
        .required(t('common:error.isRequired', { field: t('common:login.email') }) ?? ''),
      password: Yup.string().required(
        t('common:error.isRequired', { field: t('common:login.password') }) ?? ''
      )
    }),
    onSubmit: async (values) => {
      loginMutation(values);
    }
  });

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  };
  return (
    <>
      <Button variant="contained" onClick={(): void => setIsOpen(true)}>
        {t('common:login.login')}
      </Button>
      <Dialog
        open={isOpen}
        onClose={(e: Event, reason: string): void =>
          modalOnCloseHandler(e, reason, () => setIsOpen(false))
        }
        disableScrollLock
      >
        {error && <Alert severity="error">{error}</Alert>}
        <DialogTitle>{t('common:login.login')}</DialogTitle>
        <DialogContent>
          <S.Form noValidate>
            <S.InputField
              id="email"
              name="email"
              type="email"
              label={t('common:login.email')}
              size="small"
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              error={!!(touched.email && errors.email)}
              helperText={touched.email && errors.email}
              required
            />

            <S.InputField
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={(): void => setShowPassword((prev) => !prev)}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      color={
                        isPasswordFocused && !errors.password
                          ? 'primary'
                          : touched.password && errors.password
                          ? 'error'
                          : 'default'
                      }
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              label={t('common:login.password')}
              size="small"
              onChange={handleChange}
              onBlur={(e): void => {
                handleBlur(e);
                setIsPasswordFocused(false);
              }}
              value={values.password}
              error={!!(touched.password && errors.password)}
              required
              helperText={touched.password && errors.password}
              onFocus={(): void => setIsPasswordFocused(true)}
            />
          </S.Form>
        </DialogContent>
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
            {t('common:login.login')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
