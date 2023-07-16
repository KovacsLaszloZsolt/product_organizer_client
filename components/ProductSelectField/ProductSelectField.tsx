import { CSSObject, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ProductSelectFieldOptions, SelectType, SelectTypeEnum } from '../../types/product';
import { ContentCopy } from '../ContentCopy/ContentCopy';
import { AddNewSelectValueModal } from '../Modal/AddNewSelectValueModal/AddNewSelectValueModal';
import { InputWrapper } from '../Modal/ProductModal/ProductModal.styles';
import * as S from './ProductSelectField.styles';

interface ProductSelectFieldProps {
  allowedNewValue?: boolean;
  defaultValue?: number | string;
  isOnModal?: boolean;
  options?: ProductSelectFieldOptions[];
  style?: CSSObject;
  type: SelectType;
  value: number | string | null;
  withContentCopy?: boolean;
  onChange: (value: string | number) => void;
  onNewSelectValueSubmit?: (value: string) => void;
}

export const ProductSelectField = ({
  allowedNewValue = false,
  defaultValue,
  isOnModal = true,
  options = [],
  style,
  type,
  value,
  withContentCopy = false,
  onChange,
  onNewSelectValueSubmit
}: ProductSelectFieldProps): JSX.Element => {
  const { t } = useTranslation(['product', 'common']);

  return (
    <S.ProductSelectFieldWrapper isOnModal={isOnModal}>
      <InputWrapper>
        <FormControl size="small" sx={style}>
          <InputLabel id={`${type}-select`}>{t(`product:product.${type}`)}</InputLabel>
          <Select
            labelId={`${type}-select-label`}
            id={`${type}-select`}
            value={value ?? defaultValue ?? ''}
            label={t(`product:product.${type}`)}
            onChange={(e): void => {
              onChange(e.target.value);
            }}
            MenuProps={{ disableScrollLock: true }}
          >
            {options &&
              options.map((option) => {
                return (
                  <MenuItem key={option.id} value={option.id}>
                    {type === SelectTypeEnum.STATUS
                      ? t(`common:${type}.${option.name}`)
                      : option.name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>
        {withContentCopy && (
          <ContentCopy value={options.find((option) => option.id === value)?.name ?? ''} />
        )}
      </InputWrapper>
      {allowedNewValue && (
        <AddNewSelectValueModal
          name={t(`product:product.${type}`)}
          onSubmit={(value: string): void => {
            onNewSelectValueSubmit && onNewSelectValueSubmit(value);
          }}
        />
      )}
    </S.ProductSelectFieldWrapper>
  );
};
