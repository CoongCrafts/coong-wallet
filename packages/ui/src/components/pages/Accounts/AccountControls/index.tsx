import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import useMenuDropdown from 'hooks/useMenuDropdown';
import { AccountInfoExt, Props } from 'types';
import { EventName, triggerEvent } from 'utils/eventemitter';

enum AccountControlsAction {
  RenameAccount = 'Rename',
  RemoveAccount = 'Remove',
  ShowAddressQrCode = 'Show QR Code',
}

const AccountControlsOptions = [
  {
    action: AccountControlsAction.RenameAccount,
    event: EventName.OpenRenameAccountDialog,
  },
  {
    action: AccountControlsAction.ShowAddressQrCode,
    event: EventName.OpenShowAddressQrCodeDialog,
    className: 'min-[300px]:hidden',
  },
  {
    action: AccountControlsAction.RemoveAccount,
    event: EventName.OpenRemoveAccountDialog,
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
        {AccountControlsOptions.map(({ action, event, className = '' }) => (
          <MenuItem key={action} onClick={() => openDialogOnAction(event)} className={className}>
            {t<string>(action)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default AccountControls;
