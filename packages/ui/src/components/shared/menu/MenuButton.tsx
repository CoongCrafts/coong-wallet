import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu as MenuIcon } from '@mui/icons-material';
import InputIcon from '@mui/icons-material/Input';
import IosShareIcon from '@mui/icons-material/IosShare';
import { Button, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import ExportWalletDialog from 'components/shared/menu/ExportWalletDialog';
import useMenuDropdown from 'hooks/useMenuDropdown';
import { Props } from 'types';
import { EventName, triggerEvent } from 'utils/eventemitter';
import ImportAccountDialog from './ImportAccountDialog';

enum MenuAction {
  ExportWallet = 'Export Wallet',
  ImportAccount = 'Import Account',
}

const MenuOptions = [
  { action: MenuAction.ExportWallet, event: EventName.OpenExportWalletDialog, icon: <IosShareIcon /> },
  { action: MenuAction.ImportAccount, event: EventName.OpenImportAccountDialog, icon: <InputIcon /> },
];

export default function MenuButton({ className = '' }: Props): JSX.Element {
  const { t } = useTranslation();
  const { open, anchorEl, doOpen, doClose } = useMenuDropdown();

  const openDialogOnAction = (event: EventName) => {
    triggerEvent(event);
    doClose();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => doOpen(e.currentTarget);

  return (
    <>
      <Button
        title={t<string>('Menu')}
        variant='outlined'
        size='small'
        color='gray'
        className={`${className} min-w-[32px] px-1 max-xs:hidden`}
        onClick={handleClick}>
        <MenuIcon color='inherit' />
      </Button>
      <IconButton color='primary' className='xs:hidden' onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={doClose}>
        {MenuOptions.map(({ action, event, icon }) => (
          <MenuItem key={action} onClick={() => openDialogOnAction(event)}>
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText>{t<string>(action)}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
      <ExportWalletDialog />
      <ImportAccountDialog />
    </>
  );
}
