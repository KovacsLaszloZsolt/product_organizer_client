import { Delete, Edit, NoteAdd } from '@mui/icons-material';
import { Box, IconButton, TextField, Tooltip, Typography } from '@mui/material';

import { useFormik } from 'formik';
import { useTranslation } from 'next-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { patchProduct } from '../../api/product';
import { availableProductStatuses } from '../../constants/product';
import { RoleEnum } from '../../types/auth';
import {
  IntProduct,
  SelectTypeEnum,
  StatusColorEnum,
  StatusEnum,
  StatusType
} from '../../types/product';
import { ActionButtons } from '../ActionButtons/ActionButtons';
import { ImageViewer } from '../ImageViewer/ImageViewer';
import { DeleteProductModal } from '../Modal/DeleteProductModal/DeleteProductModal';
import { ProductModal } from '../Modal/ProductModal/ProductModal';
import { ProductSelectField } from '../ProductSelectField/ProductSelectField';
import { useProduct } from '../hooks/useProduct';
import { useUser } from '../hooks/useUser';
import * as S from './ProductListItem.styles';

interface ProductListItemProps {
  product: IntProduct;
}

export const ProductListItem = ({ product }: ProductListItemProps): JSX.Element => {
  const { t } = useTranslation(['common', 'product']);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] = useState(false);
  const [isProductNoteEdit, setIsProductNoteEdit] = useState(false);
  const noteElementRef = useRef<HTMLDivElement | null>(null);

  const { user } = useUser();
  const { mutateProduct } = useProduct({});
  const isAdmin = useMemo(() => user?.role === RoleEnum.ADMIN, [user]);

  const handleProductStatusChange = async (status: StatusType): Promise<void> => {
    const updateProduct: Partial<Pick<IntProduct, 'status' | 'note'>> = { status };

    if (status !== StatusEnum.BOOKED) {
      updateProduct.note = '';
      setIsProductNoteEdit(false);
      resetForm();
    }

    mutateProduct(() => patchProduct({ updateProduct, id: product.id }));
  };

  const handleNoteChange = async (note: string): Promise<void> => {
    mutateProduct(() => patchProduct({ updateProduct: { note }, id: product.id }));
  };

  const { values, initialValues, handleChange, handleSubmit, resetForm } = useFormik({
    initialValues: { note: product.note ?? '' },
    onSubmit: (values) => {
      handleNoteChange(values.note);
      setIsProductNoteEdit(false);
    },
    enableReinitialize: true
  });

  useEffect(() => {
    if (isProductNoteEdit) {
      noteElementRef.current?.focus();
    }
  }, [isProductNoteEdit]);

  return (
    <>
      <S.Product>
        <ImageViewer images={product.images} />
        <S.Line />
        <S.DetailsWrapper>
          <S.ProductHeader>
            <S.StyledBadge
              badgeContent={t(`common:status.${product.status}`)}
              color={StatusColorEnum[product.status]}
            >
              <S.ProductName>{product.name}</S.ProductName>
            </S.StyledBadge>

            {isAdmin && (
              <S.ActionsContainer>
                <Tooltip title={t('common:edit')}>
                  <IconButton
                    sx={{
                      color: 'grey',

                      '&:hover': {
                        color: 'orange'
                      }
                    }}
                    onClick={(): void => {
                      setIsEditProductModalOpen(true);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>

                {product.status === StatusEnum.BOOKED && (
                  <Tooltip title={t('common:note')}>
                    <IconButton
                      sx={{
                        color: 'grey',

                        '&:hover': {
                          color: 'green'
                        }
                      }}
                      onClick={(): void => {
                        setIsProductNoteEdit(true);
                        noteElementRef.current?.focus();
                      }}
                    >
                      <NoteAdd />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title={t('common:delete')}>
                  <IconButton
                    sx={{
                      color: 'grey',

                      '&:hover': {
                        color: 'red'
                      }
                    }}
                    onClick={(): void => {
                      setIsProductDeleteModalOpen(true);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </S.ActionsContainer>
            )}
          </S.ProductHeader>

          <div>{product.description}</div>
          <S.ActionsContainerButton>
            {isAdmin &&
              product.status === StatusEnum.BOOKED &&
              (isProductNoteEdit || product.note) && (
                <Box marginRight="auto" display={'flex'} alignItems={'center'} gap={'1rem'}>
                  <TextField
                    inputProps={{ sx: { cursor: !isProductNoteEdit ? 'pointer' : 'unset' } }}
                    autoFocus
                    disabled={!isProductNoteEdit}
                    id="note"
                    label={t('product:product.note')}
                    multiline
                    onChange={handleChange}
                    inputRef={noteElementRef}
                    size="small"
                    value={values.note}
                    variant="outlined"
                    onClick={(): void => {
                      setIsProductNoteEdit(true);
                    }}
                  />
                  <ActionButtons
                    isVisible={initialValues.note !== values.note}
                    handleCancel={(): void => {
                      resetForm();
                      setIsProductNoteEdit(false);
                    }}
                    handleSave={handleSubmit}
                  />
                </Box>
              )}
            {product.price && (
              <Typography variant="h6">
                {t('product:product.price')}: {product.price} {t('common:currency')}
              </Typography>
            )}
            {isAdmin && (
              <ProductSelectField
                options={availableProductStatuses.map((status) => ({ id: status, name: status }))}
                type={SelectTypeEnum.STATUS}
                value={product.status}
                defaultValue={StatusEnum.AVAILABLE}
                onChange={(value): void => {
                  const status = value as StatusType;
                  handleProductStatusChange(status);
                }}
                isOnModal={false}
                style={{ width: '7rem', marginLeft: '1rem' }}
              />
            )}
          </S.ActionsContainerButton>
        </S.DetailsWrapper>
      </S.Product>
      {isEditProductModalOpen && (
        <ProductModal
          product={product}
          onClose={(): void => {
            setIsEditProductModalOpen(false);
          }}
        />
      )}
      {isProductDeleteModalOpen && (
        <DeleteProductModal
          productId={product.id}
          productName={product.name}
          onClose={(): void => {
            setIsProductDeleteModalOpen(false);
          }}
        />
      )}
    </>
  );
};
