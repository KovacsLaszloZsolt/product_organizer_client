import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Avatar, Box, Button, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { useMemo, useState } from 'react';
import { useUser } from '../hooks/useUser';

export const UserMenu = (): JSX.Element => {
  const { t } = useTranslation('common');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, clearUser } = useUser();

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    clearUser();
    handleClose();
  };

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          id="user-button"
          aria-controls={open ? 'user-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
        >
          <Avatar>{`${user?.lastName[0]}${user?.firstName[0]}`}</Avatar>
          {open ? <ExpandLess /> : <ExpandMore />}
        </Button>
      </Box>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'user-button'
        }}
        disableScrollLock
      >
        {/* <MenuItem onClick={handleClose}>Profile</MenuItem> */}
        <MenuItem onClick={handleLogout}>{t('common:logout')}</MenuItem>
      </Menu>
    </div>
  );
};
