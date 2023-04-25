import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import useMenuDropdown from 'hooks/useMenuDropdown';
import { AccountInfoExt, Props } from 'types';
import { EventName, triggerEvent } from 'utils/eventemitter';

enum AccountControlsAction {
  RemoveAccount = 'Remove',
}

const AccountControlsOptions = [
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
        {AccountControlsOptions.map(({ action, event }) => (
          <MenuItem key={action} onClick={() => openDialogOnAction(event)}>
            {t<string>(action)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default AccountControls;
