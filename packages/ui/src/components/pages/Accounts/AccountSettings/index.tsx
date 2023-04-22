import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { IconButton, Menu, MenuItem } from '@mui/material';
import RemovingAccountDialog from 'components/pages/Accounts/AccountSettings/RemovingAccountDialog';
import useMenuDropdown from 'hooks/useMenuDropdown';
import { AccountInfoExt, Props, AccountSettingsAction } from 'types';

const AccountSettingsOptions = [{ action: AccountSettingsAction.RemoveAccount, label: 'Remove' }];

interface ActionDialogProps extends Props {
  action: AccountSettingsAction;
  account: AccountInfoExt;
  open: boolean;
  onClose: () => void;
}

const ActionDialog: FC<ActionDialogProps> = ({ action, ...props }) => {
  switch (action) {
    case AccountSettingsAction.RemoveAccount:
      return <RemovingAccountDialog {...props} />;
    default:
      return null;
  }
};

interface AccountSettingsProps extends Props {
  account: AccountInfoExt;
}

const AccountSettings: FC<AccountSettingsProps> = ({ className = '', account }) => {
  const { t } = useTranslation();
  const { open, anchorEl, doOpen, doClose } = useMenuDropdown();
  const [action, setAction] = useState<AccountSettingsAction | null>();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => doOpen(event.currentTarget);
  const handleClose = () => setAction(null);
  const openDialogOnAction = (action: AccountSettingsAction) => {
    doClose();
    setAction(action);
  };

  return (
    <div className={className}>
      <IconButton onClick={handleClick} title={t<string>('Open account settings')}>
        <MoreVertIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={doClose}>
        {AccountSettingsOptions.map(({ action, label }) => (
          <MenuItem key={action} onClick={() => openDialogOnAction(action)}>
            {t<string>(label)}
          </MenuItem>
        ))}
      </Menu>
      <ActionDialog action={action!} account={account} open={action !== null} onClose={handleClose} />
    </div>
  );
};

export default AccountSettings;
