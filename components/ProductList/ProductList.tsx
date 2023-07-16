import { Box, Divider } from '@mui/material';
import { flatten, isEmpty } from 'lodash';
import { useTranslation } from 'next-i18next';
import { Fragment, useEffect, useMemo, useRef } from 'react';
import { IntProduct } from '../../types/product';
import { ProductListItem } from '../ProductListItem/ProductListItem';
import { useProducts } from '../hooks/useProductList';
import * as S from './ProductList.styles';

export const ProductList = (): JSX.Element => {
  const { t } = useTranslation('product');
  const { data, hasNextPage, fetchNextPage } = useProducts();
  const thirdToLastItemRef = useRef<HTMLSpanElement | null>(null);

  const products = useMemo(() => {
    return flatten((data?.pages as IntProduct[][]) ?? []);
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    if (thirdToLastItemRef.current) {
      observer.observe(thirdToLastItemRef.current);
    }

    return () => {
      if (thirdToLastItemRef.current) {
        observer.unobserve(thirdToLastItemRef.current);
      }
    };
  }, [products]);

  return (
    <>
      {!isEmpty(data) ? (
        <S.ListWrapper spacing={2} pt="1rem">
          {products.map((product: IntProduct, index: number) => {
            return (
              <Fragment key={product.id}>
                <ProductListItem product={product} />
                <Divider sx={{ margin: '1rem 1rem 0 !important' }} />
                {index === products.length - 3 && <span ref={thirdToLastItemRef} />}
              </Fragment>
            );
          })}
        </S.ListWrapper>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', fontWeight: '600' }} pt={8}>
          {t('product:emptyList')}
        </Box>
      )}
    </>
  );
};
