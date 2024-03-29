import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle as MuiDialogTitle, IconButton } from '@mui/material';
import { Props } from 'types';

export interface DialogTitleProps extends Props {
  onClose?: () => void;
  disabled?: boolean;
}

const DialogTitle: FC<DialogTitleProps> = ({ className = '', children, onClose, disabled = false }) => {
  const { t } = useTranslation();

  return (
    <MuiDialogTitle className={`${className} flex justify-between`}>
      {children}
      {onClose && (
        <IconButton onClick={onClose} disabled={disabled} title={t<string>('Close')} className='self-start p-1'>
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogTitle>
  );
};

export default DialogTitle;
