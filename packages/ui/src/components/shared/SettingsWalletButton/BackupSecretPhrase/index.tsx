import { FC } from 'react';
import { useSelector } from 'react-redux';
import { DialogContent, DialogContentText } from '@mui/material';
import { RootState } from '../../../../redux/store';
import { Props } from '../../../../types';
import DialogTitle from '../../DialogTitle';
import ShowingSecretPhrase from './ShowingSecretPhrase';
import VerifyingPassword from './VerifyingPassword';

interface BackupSecretPhraseProps extends Props {
  onClose: () => {};
}

const BackupSecretPhrase: FC<BackupSecretPhraseProps> = ({ onClose }) => {
  const { password } = useSelector((state: RootState) => state.settingsDialog);

  return (
    <>
      <DialogTitle onClose={onClose}>Settings / Backup secret recovery phrase</DialogTitle>
      <DialogContent className='pb-8'>
        <DialogContentText>
          You are about to reveal the secret recovery phrase which give access to your accounts and funds. Make sure you
          are in a safe place.
        </DialogContentText>
        {password ? <ShowingSecretPhrase /> : <VerifyingPassword />}
      </DialogContent>
    </>
  );
};

export default BackupSecretPhrase;
