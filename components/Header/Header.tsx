import { Add, Check, Close, Search } from '@mui/icons-material';
import { Button, InputAdornment, TextField } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { useProductsStore } from '../../store/home';
import { RoleEnum } from '../../types/auth';
import { UserMenu } from '../Menu/UserMenu';
import { Login } from '../Modal/Login/Login';
import { ProductModal } from '../Modal/ProductModal/ProductModal';
import { ToastMessage } from '../ToastMessage/ToastMessage';
import { Toolbar } from '../Toolbar/Toolbar';
import { useUser } from '../commonHooks/useUser';
import * as S from './Header.styles';

export const Header = (): JSX.Element => {
  const { t } = useTranslation('common');
  const { user } = useUser();
  const [isCreateProductModalOpen, setIsCreateProductModalOpen] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');
  const { searchValue, setSearchValue } = useProductsStore();

  return (
    <>
      <S.Header>
        <S.Wrapper>
          <S.PageTitle>Eszter page</S.PageTitle>
          {user ? <UserMenu /> : <Login />}
        </S.Wrapper>
        <>
          <Toolbar />
          <S.ActionContainer>
            <TextField
              id="input-with-icon-textfield"
              InputProps={{
                style: {
                  height: '2.5rem'
                },
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    <InputAdornment
                      style={{
                        opacity: searchInputValue && searchInputValue !== searchValue ? 1 : 0,
                        cursor: 'pointer'
                      }}
                      position="end"
                      onClick={(): void => {
                        setSearchValue(searchInputValue);
                      }}
                    >
                      <Check color="success" />
                    </InputAdornment>
                    <InputAdornment
                      style={{
                        opacity: searchInputValue ? 1 : 0,
                        cursor: 'pointer'
                      }}
                      position="end"
                      onClick={(): void => {
                        setSearchInputValue('');
                        setSearchValue('');
                      }}
                    >
                      <Close color="error" />
                    </InputAdornment>
                  </>
                )
              }}
              variant="outlined"
              value={searchInputValue}
              onChange={(e): void => {
                setSearchInputValue(e.target.value);
              }}
              onKeyUp={(e): void => {
                if (e.key === 'Enter') {
                  setSearchValue(searchInputValue);
                }
              }}
            />

            {user?.role === RoleEnum.ADMIN && (
              <Button
                style={{ height: '2.5rem' }}
                variant="outlined"
                startIcon={<Add />}
                onClick={(): void => {
                  setIsCreateProductModalOpen(true);
                }}
              >
                {t('common:create')}
              </Button>
            )}
          </S.ActionContainer>
        </>
        <ToastMessage />
      </S.Header>
      {isCreateProductModalOpen && (
        <ProductModal
          onClose={(): void => {
            setIsCreateProductModalOpen(false);
          }}
        />
      )}
    </>
  );
};
