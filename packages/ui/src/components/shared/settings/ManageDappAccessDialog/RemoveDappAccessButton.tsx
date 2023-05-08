import React, { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AppInfo } from '@coong/base/requests/WalletState';
import { Delete } from '@mui/icons-material';
import { Button, IconButton } from '@mui/material';
import { Props } from 'types';
import { EventName, triggerEvent } from 'utils/eventemitter';

interface RemoveSingleDappAccessButtonProps extends Props {
  appInfo: AppInfo;
  onRemoved?: () => void;
  showToast?: boolean;
  buttonIconStyle?: boolean;
}

export default function RemoveDappAccessButton({
  appInfo,
  onRemoved,
  showToast,
  buttonIconStyle,
}: RemoveSingleDappAccessButtonProps) {
  const { t } = useTranslation();

  const openRemovalDialog = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    triggerEvent(EventName.OpenRemoveDappAccessDialog, { appInfo, onRemoved, showToast });
  };

  return buttonIconStyle ? (
    <IconButton size='small' onClick={openRemovalDialog}>
      <Delete fontSize='small' />
    </IconButton>
  ) : (
    <Button size='small' color='error' variant='outlined' onClick={openRemovalDialog}>
      {t<string>('Remove Access')}
    </Button>
  );
}
