import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton } from '@mui/material';

interface ContentCopyProps {
  value: string;
}

export const ContentCopy = ({ value }: ContentCopyProps): JSX.Element => {
  const handleButtonClick = (): void => {
    navigator.clipboard.writeText(value);
  };
  return (
    <IconButton color="primary" onClick={handleButtonClick}>
      <ContentCopyIcon />
    </IconButton>
  );
};
