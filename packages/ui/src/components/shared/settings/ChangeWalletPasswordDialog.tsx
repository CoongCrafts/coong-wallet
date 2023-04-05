import { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Button, DialogContent } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import { Props } from 'types';
import { settingsDialogActions } from '../../../redux/slices/settings-dialog';

interface ChangeWalletPasswordDialogProps extends Props {
  onClose: () => void;
}

const ChangeWalletPasswordDialog: FC<ChangeWalletPasswordDialogProps> = ({ onClose }) => {
  const dispatch = useDispatch();

  return (
    <>
      <DialogTitle onClose={onClose}>This feature is still in development, it's good for you to comeback</DialogTitle>
      <DialogContent>
        <Button onClick={() => dispatch(settingsDialogActions.resetState())} fullWidth>
          Back to Settings
        </Button>
      </DialogContent>
    </>
  );
};

export default ChangeWalletPasswordDialog;
