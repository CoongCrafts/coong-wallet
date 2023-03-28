import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle as MuiDialogTitle, IconButton } from '@mui/material';
import { Props } from 'types';

export interface DialogTitleProps extends Props {
  onClose: () => void;
}

const DialogTitle: FC<DialogTitleProps> = ({ className = '', children, onClose }) => {
  const { t } = useTranslation();

  return (
    <MuiDialogTitle>
      {children}
      <IconButton onClick={onClose} title={t<string>('Close settings')} className='absolute right-4 top-3'>
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
};

export default DialogTitle;
