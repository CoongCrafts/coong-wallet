import React from 'react';
import { useTranslation } from 'react-i18next';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import ExportWalletDialog from 'components/shared/menu/ExportWalletDialog';
import useMenuDropdown from 'hooks/useMenuDropdown';
import useThemeMode from 'hooks/useThemeMode';
import { Props } from 'types';
import { EventName, triggerEvent } from 'utils/eventemitter';

export default function MenuButton({ className = '' }: Props): JSX.Element {
  const { t } = useTranslation();
  const { open, anchorEl, doOpen, doClose } = useMenuDropdown();
  const { dark } = useThemeMode();

  const onClickExportWallet = () => {
    doClose();
    triggerEvent(EventName.OpenExportWalletDialog);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => doOpen(e.currentTarget);

  return (
    <>
      <Button
        title={t<string>('Menu')}
        variant='outlined'
        size='small'
        color={dark ? 'grayLight' : 'gray'}
        className={`${className} min-w-[32px] px-1 max-xs:hidden`}
        onClick={handleClick}>
        <MenuIcon color='inherit' />
      </Button>
      <IconButton color='primary' className='xs:hidden' onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu open={open} anchorEl={anchorEl} onClose={doClose}>
        <MenuItem onClick={onClickExportWallet}>{t<string>('Export Wallet')}</MenuItem>
      </Menu>
      <ExportWalletDialog />
    </>
  );
}
