import React, { FC, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import RemovingAccount from 'components/pages/Accounts/AccountSettings/RemovingAccount';
import useMenuDropdown from 'hooks/useMenuDropdown';
import { AccountInfoExt, Props, AccountSettingsAction } from 'types';

const AccountSettingsOptions = [{ action: AccountSettingsAction.RemoveAccount, label: 'Remove' }];

interface ActionComponentProps extends Props {
  action: AccountSettingsAction;
  account: AccountInfoExt;
  open: boolean;
  onClose: () => void;
}

const ActionComponent: FC<ActionComponentProps> = ({ action, ...props }) => {
  switch (action) {
    case AccountSettingsAction.RemoveAccount:
      return <RemovingAccount {...props} />;
    default:
      return null;
  }
};

interface AccountSettingsProps extends Props {
  account: AccountInfoExt;
}

const AccountSettings: FC<AccountSettingsProps> = ({ className = '', account }) => {
  const { open, anchorEl, doOpen, doClose } = useMenuDropdown();
  const [action, setAction] = useState<AccountSettingsAction | null>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    doOpen(event.currentTarget);
  };

  const handleClose = () => {
    setAction(null);
  };

  const doAction = (action: AccountSettingsAction) => {
    doClose();
    setAction(action);
  };

  return (
    <div className={className}>
      <IconButton onClick={handleClick} title='Open account settings'>
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={doClose}>
        {AccountSettingsOptions.map(({ action, label }) => (
          <MenuItem key={action} onClick={() => doAction(action)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
      <ActionComponent action={action!} account={account} open={action !== null} onClose={handleClose} />
    </div>
  );
};

export default AccountSettings;
