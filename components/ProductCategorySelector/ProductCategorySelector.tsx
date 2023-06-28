import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { AddNewSelectValueModal } from '../Modal/AddNewSelectValueModal/AddNewSelectValueModal';
import { InputWrapper } from '../Modal/ProductModal/ProductModal.styles';
import { useProductCategory } from './useProductCategory';
import { ContentCopy } from '../ContentCopy/ContentCopy';

interface ProductCategorySelectorProps {
  value: number | null;
  onChange: (e: SelectChangeEvent<number>) => void;
}

export const ProductCategorySelector = ({
  value,
  onChange
}: ProductCategorySelectorProps): JSX.Element => {
  const { t } = useTranslation('product');
  const { categories, createCategoryMutation } = useProductCategory();

  return (
    <>
      <InputWrapper>
        <FormControl fullWidth size="small">
          <InputLabel id="category-selector-label">{t('product:product.category')}</InputLabel>
          <Select
            labelId="category-selector-label-id"
            id="category-selector"
            value={value ?? ''}
            label={t('product:product.category')}
            onChange={onChange}
          >
            {categories?.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <ContentCopy value={categories?.find((category) => category.id === value)?.name ?? ''} />
      </InputWrapper>
      <AddNewSelectValueModal
        name={t('product:product.category')}
        onSubmit={(name: string): void => {
          createCategoryMutation(name);
        }}
      />
    </>
  );
};
