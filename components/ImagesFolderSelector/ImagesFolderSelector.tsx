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
import { useImagesFolderSelector } from './useImagesFolderSelector';

interface ImagesFolderSelectorProps {
  imagesFolder: number | null;
  style?: CSSObject;
  onChange: (e: SelectChangeEvent<number>) => void;
}

export const ImagesFolderSelector = ({
  imagesFolder,
  onChange,
  style
}: ImagesFolderSelectorProps): JSX.Element => {
  const { t } = useTranslation(['product']);
  const { imagesFolders, createImageFolder } = useImagesFolderSelector();

  return (
    <>
      <FormControl size="small" sx={style}>
        <InputLabel id="images-folder-select">{t('product:product.imagesFolder')}</InputLabel>
        <Select
          labelId="images-folder-select-label"
          id="images-folder-select"
          value={imagesFolder ?? ''}
          label={t('product:product.imagesFolder')}
          onChange={(e): void => {
            onChange(e);
          }}
          MenuProps={{ disableScrollLock: true }}
        >
          {imagesFolders &&
            imagesFolders.map((folder) => (
              <MenuItem key={folder.id} value={folder.id}>
                {folder.name}
              </MenuItem>
            ))}
        </Select>
        <AddNewSelectValueModal
          name={t('product:product.imagesFolder')}
          onSubmit={(name: string): void => {
            createImageFolder(name);
          }}
        />
      </FormControl>
    </>
  );
};
