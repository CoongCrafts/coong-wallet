import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import useMenuDropdown from 'hooks/useMenuDropdown';
import { AccountInfoExt, Props } from 'types';
import { EventName, triggerEvent } from 'utils/eventemitter';

enum AccountControlsAction {
  RenameAccount = 'Rename',
  RemoveAccount = 'Remove',
  ShowAddressQrCode = 'Show Address QR Code',
}

const AccountControlsOptions = [
  {
    action: AccountControlsAction.ShowAddressQrCode,
    event: EventName.OpenShowAddressQrCodeDialog,
    icon: <QrCodeIcon />,
    className: 'min-[301px]:hidden',
  },
  {
    action: AccountControlsAction.RenameAccount,
    event: EventName.OpenRenameAccountDialog,
    icon: <DriveFileRenameOutlineIcon />,
  },
  {
    action: AccountControlsAction.RemoveAccount,
    event: EventName.OpenRemoveAccountDialog,
    icon: <DeleteIcon />,
  },
];

interface AccountControlsProps extends Props {
  account: AccountInfoExt;
}

const AccountControls: FC<AccountControlsProps> = ({ className = '', account }) => {
  const { t } = useTranslation();
  const { open, anchorEl, doOpen, doClose } = useMenuDropdown();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => doOpen(event.currentTarget);

  const openDialogOnAction = (event: EventName) => {
    triggerEvent(event, account);
    doClose();
  };

  return (
    <div className={className}>
      <IconButton onClick={handleClick} title={t<string>('Open account controls')}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={doClose}>
        {AccountControlsOptions.map(({ action, event, icon, className = '' }) => (
          <MenuItem key={action} onClick={() => openDialogOnAction(event)} className={className}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{t<string>(action)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default AccountControls;
