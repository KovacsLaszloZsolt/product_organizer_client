import { Divider } from '@mui/material';
import { IntProduct } from '../../types/product';
import { ProductListItem } from '../ProductListItem/ProductListItem';
import * as S from './ProductList.styles';
import { useProducts } from './useProductList';

export const ProductList = (): JSX.Element => {
  const { productsQuery } = useProducts();

  const { data } = productsQuery;

  // TODO: add moon loader
  return (
    <>
      {data && (
        <S.ListWrapper spacing={2} pt="1rem">
          {data?.map((product: IntProduct) => (
            <span key={product.id}>
              <ProductListItem product={product} />
              <Divider sx={{ margin: '1rem 1rem 0 !important' }} />
            </span>
          ))}
        </S.ListWrapper>
      )}
    </>
  );
};
