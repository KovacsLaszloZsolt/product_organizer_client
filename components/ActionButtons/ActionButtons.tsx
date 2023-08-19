import { Check, Clear } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import * as S from './ActionButtons.styles';

interface ActionButtonsProps {
  isVisible: boolean;
  handleCancel: () => void;
  handleSave: () => void;
}

export const ActionButtons: FC<ActionButtonsProps> = ({ isVisible, handleCancel, handleSave }) => {
  const { t } = useTranslation('common');
  return (
    <S.FormButtons isVisible={isVisible}>
      <IconButton aria-label={t(`common:toolbar.button.apply`) || undefined} onClick={handleSave}>
        <Check color="success" />
      </IconButton>
      <IconButton
        aria-label={t(`common:toolbar.button.delete`) || undefined}
        onClick={handleCancel}
      >
        <Clear color="error" />
      </IconButton>
    </S.FormButtons>
  );
};
