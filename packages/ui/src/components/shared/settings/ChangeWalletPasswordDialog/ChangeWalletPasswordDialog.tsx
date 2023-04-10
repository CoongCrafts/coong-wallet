import { FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs, DialogContent, DialogContentText, Link, Typography } from '@mui/material';
import { settingsDialogActions } from '../../../../redux/slices/settings-dialog';
import { RootState } from '../../../../redux/store';
import { Props } from '../../../../types';
import DialogTitle from '../../DialogTitle';
import VerifyingPassword from '../VerifyingPassword';
import ChangingWalletPassword from './ChangingWalletPassword';

interface ChangeWalletPasswordDialogProps extends Props {
  onClose: () => void;
}

const ChangeWalletPasswordDialog: FC<ChangeWalletPasswordDialogProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { verifiedPassword } = useSelector((state: RootState) => state.settingsDialog);

  return (
    <>
      <DialogTitle onClose={onClose}>
        <Breadcrumbs>
          <Link
            className='cursor-pointer'
            underline='hover'
            color='inherit'
            variant='h6'
            onClick={() => dispatch(settingsDialogActions.resetState())}>
            {t<string>('Settings')}
          </Link>
          <Typography color='text.primary' variant='h6'>
            {t<string>('Change wallet password')}
          </Typography>
        </Breadcrumbs>
      </DialogTitle>
      <DialogContent className='pb-8 flex-col flex gap-2'>
        <DialogContentText>
          <Trans>
            Your password will be used to encrypt accounts as well as unlock the wallet, make sure to pick a strong &
            easy-to-remember password
          </Trans>
        </DialogContentText>
        <DialogContentText>
          <Trans>
            The password changing process might take time if there're many accounts in the wallet, please be patient.
          </Trans>
        </DialogContentText>
        {verifiedPassword ? <ChangingWalletPassword /> : <VerifyingPassword />}
      </DialogContent>
    </>
  );
};

export default ChangeWalletPasswordDialog;
