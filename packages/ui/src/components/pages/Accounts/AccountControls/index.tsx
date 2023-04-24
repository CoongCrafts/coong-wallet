import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import useMenuDropdown from 'hooks/useMenuDropdown';
import { AccountInfoExt, AccountControlsAction, Props } from 'types';
import { EventName, triggerEvent } from 'utils/eventemitter';

const AccountControlsOptions = [{ action: AccountControlsAction.RemoveAccount, label: 'Remove' }];

interface AccountControlsProps extends Props {
  account: AccountInfoExt;
}

const AccountControls: FC<AccountControlsProps> = ({ className = '', account }) => {
  const { t } = useTranslation();
  const { open, anchorEl, doOpen, doClose } = useMenuDropdown();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => doOpen(event.currentTarget);
  const openDialogOnAction = (action: AccountControlsAction) => {
    doClose();
    switch (action) {
      case AccountControlsAction.RemoveAccount:
        triggerEvent(EventName.OPEN_REMOVE_ACCOUNT_DIALOG, account);
        break;
    }
  };

  return (
    <div className={className}>
      <IconButton onClick={handleClick} title={t<string>('Open account controls')}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={doClose}>
        {AccountControlsOptions.map(({ action, label }) => (
          <MenuItem key={action} onClick={() => openDialogOnAction(action)}>
            {t<string>(label)}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default AccountControls;
