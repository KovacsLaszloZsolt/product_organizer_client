import { Delete, Edit } from '@mui/icons-material';
import { IconButton, Tooltip, Typography } from '@mui/material';

import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
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

  const { user } = useUser();
  const { mutateProduct } = useProduct({});
  const isAdmin = useMemo(() => user?.role === RoleEnum.ADMIN, [user]);

  const handleProductStatusChange = async (status: StatusType): Promise<void> => {
    mutateProduct(() => patchProduct({ updateProduct: { status }, id: product.id }));
  };

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
