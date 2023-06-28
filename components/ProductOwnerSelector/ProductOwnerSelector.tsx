import {
  CSSObject,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { AddNewSelectValueModal } from '../Modal/AddNewSelectValueModal/AddNewSelectValueModal';
import { useProductOwner } from './useProductOwner';

interface ProductStatusSelectorProps {
  onChange: (e: SelectChangeEvent<number>) => void;
  owner: number | null;
  style?: CSSObject;
}

export const ProductOwnerSelector = ({
  owner,
  onChange,
  style
}: ProductStatusSelectorProps): JSX.Element => {
  const { t } = useTranslation(['product']);
  const { productOwners, createProductOwner } = useProductOwner();

  return (
    <>
      <FormControl size="small" sx={style}>
        <InputLabel id="owner-select">{t('product:product.owner')}</InputLabel>
        <Select
          labelId="owner-select-label"
          id="owner-select-select"
          value={owner ?? ''}
          label={t('product:product.owner')}
          onChange={(e): void => {
            onChange(e);
          }}
          MenuProps={{ disableScrollLock: true }}
        >
          {productOwners &&
            productOwners.map((owner) => (
              <MenuItem key={owner.id} value={owner.id}>
                {owner.name}
              </MenuItem>
            ))}
        </Select>
        <AddNewSelectValueModal
          name={t('product:product.owner')}
          onSubmit={(name: string): void => {
            createProductOwner(name);
          }}
        />
      </FormControl>
    </>
  );
};
