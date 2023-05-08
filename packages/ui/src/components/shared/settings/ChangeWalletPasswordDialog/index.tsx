import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumbs, DialogContent, Link, Typography } from '@mui/material';
import DialogTitle from 'components/shared/DialogTitle';
import ChangingWalletPassword from 'components/shared/settings/ChangeWalletPasswordDialog/ChangingWalletPassword';
import VerifyingPassword from 'components/shared/settings/VerifyingPassword';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface ChangeWalletPasswordDialogProps extends Props {
  onClose: () => void;
}

const ChangeWalletPasswordDialog: FC<ChangeWalletPasswordDialogProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { verifiedPassword } = useSelector((state: RootState) => state.settingsDialog);
  const { onChangingPassword } = useSelector((state: RootState) => state.settingsDialog);

  return (
    <>
      <DialogTitle onClose={onClose} disabled={onChangingPassword}>
        <Breadcrumbs>
          <Link
            className='cursor-pointer'
            component='button'
            disabled={onChangingPassword}
            underline='hover'
            color='inherit'
            variant='h6'
            onClick={() => dispatch(settingsDialogActions.resetState())}>
            {t<string>('Settings')}
          </Link>
          <Typography color='text.primary' variant='h6'>
            {t<string>('Change Wallet Password')}
          </Typography>
        </Breadcrumbs>
      </DialogTitle>
      <DialogContent>{verifiedPassword ? <ChangingWalletPassword /> : <VerifyingPassword />}</DialogContent>
    </>
  );
};

export default ChangeWalletPasswordDialog;
