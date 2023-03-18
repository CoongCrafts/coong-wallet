import React, { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { DialogTitle as MuiDialogTitle, IconButton } from '@mui/material';
import { Props } from 'types';

export interface DialogTitleProps extends Props {
  onClose: () => void;
}

const DialogTitle: FC<DialogTitleProps> = ({ className = '', children, onClose }) => {
  return (
    <MuiDialogTitle>
      {children}
      <IconButton onClick={onClose} title='Close settings' className='absolute right-4 top-3'>
        <CloseIcon />
      </IconButton>
    </MuiDialogTitle>
  );
};

export default DialogTitle;
