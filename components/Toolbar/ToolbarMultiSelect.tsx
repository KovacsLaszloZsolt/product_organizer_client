import {
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { useTranslation } from 'next-i18next';
import { ReactNode, useMemo } from 'react';
import { ProductSelectFieldOptions, StatusType } from '../../types/product';

interface StatusSelectOptions {
  id: StatusType;
  name: string;
}

interface ToolbarMultiSelectProps {
  options: (ProductSelectFieldOptions | StatusSelectOptions)[];
  type: string;
  values: (number | StatusType)[];
  valuesKey: string;
  handleChange: (e: SelectChangeEvent<(number | StatusType)[]>, key: string) => void;
}

export const ToolbarMultiSelect = ({
  options,
  type,
  values,
  valuesKey,
  handleChange
}: ToolbarMultiSelectProps): JSX.Element => {
  const { t } = useTranslation('product');

  const renderValues = useMemo(() => {
    return options?.reduce((prev, curr) => {
      if (values.includes(curr.id)) {
        prev.push(curr.name);
      }

      return prev;
    }, [] as string[]);
  }, [values, options]);

  return (
    <FormControl sx={{ width: 200 }}>
      <InputLabel
        id={`${t(`product:product.${type}`)}-label`}
        sx={{
          mt: -5,
          ml: '-14px'
        }}
        shrink={false}
      >
        {t(`product:product.${type}`)}
      </InputLabel>
      <Select
        size="small"
        labelId={`${t(`product:product.${type}`)}-label`}
        id={`${t(`product:product.${type}`)}-checkbox`}
        multiple
        displayEmpty
        value={values}
        onChange={(e): void => {
          handleChange(e, valuesKey);
        }}
        renderValue={(): string | ReactNode => {
          if (!renderValues || renderValues.length === 0) {
            return <em>{t(`common:select.all`)}</em>;
          }
          return renderValues.join(', ');
        }}
        MenuProps={{ disableScrollLock: true }}
      >
        {options?.map((option) => (
          <MenuItem key={option.id} value={option.id} style={{ width: 200 }}>
            <Checkbox checked={values.indexOf(option.id) > -1} />
            <Typography noWrap>{option.name}</Typography>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
