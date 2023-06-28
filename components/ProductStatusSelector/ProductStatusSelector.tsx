import {
  CSSObject,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { availableProductStatuses } from '../../constants/product';
import { StatusEnum, StatusType } from '../../types/product';

interface ProductStatusSelectorProps {
  onChange: (e: SelectChangeEvent) => void;
  status?: StatusType;
  style?: CSSObject;
}

export const ProductStatusSelector = ({
  status,
  onChange,
  style
}: ProductStatusSelectorProps): JSX.Element => {
  const { t } = useTranslation('common');
  return (
    <FormControl size="small" sx={style}>
      <InputLabel id="status-select">{t('common:status.status')}</InputLabel>
      <Select
        labelId="status-select-label"
        id="status-select-select"
        value={status ?? StatusEnum.AVAILABLE}
        label={t('common:status.status')}
        onChange={(e): void => {
          onChange(e);
        }}
        MenuProps={{ disableScrollLock: true }}
      >
        {availableProductStatuses.map((status) => (
          <MenuItem key={status} value={status}>
            {t(`common:status.${status}`)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
