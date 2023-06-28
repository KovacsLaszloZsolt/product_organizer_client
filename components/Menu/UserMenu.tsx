import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Avatar, Box, Button, Menu, MenuItem } from '@mui/material';
import { useMemo, useState } from 'react';
import { useUser } from '../commonHooks/useUser';

export const UserMenu = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, clearUser } = useUser();

  const open = useMemo(() => Boolean(anchorEl), [anchorEl]);

  const initials = useMemo(() => {
    return `${user?.lastName[0]}${user?.firstName[0]}`;
  }, [user]);

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
          <Avatar>{initials}</Avatar>
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
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};
