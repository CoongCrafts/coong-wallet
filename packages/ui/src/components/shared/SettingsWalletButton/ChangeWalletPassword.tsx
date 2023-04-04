import { FC } from 'react';
import { DialogContent, DialogContentText } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import { Props } from 'types';

interface ChangeWalletPasswordProps extends Props {
  onClose: () => void;
}

const ChangeWalletPassword: FC<ChangeWalletPasswordProps> = ({ onClose }) => {
  return (
    <>
      <DialogTitle onClose={onClose}>Settings/Change wallet password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Your password is used to unlock the wallet and encrypt accounts on the device, we recommend using a strong and
          easy-to-remember password.
        </DialogContentText>
        <DialogContentText>Current password</DialogContentText>
        <DialogContentText>New password</DialogContentText>
      </DialogContent>
    </>
  );
};

export default ChangeWalletPassword;
