import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useToggle } from 'react-use';
import { Close } from '@mui/icons-material';
import { AppBar, Button, Container, Dialog, DialogContent, IconButton, Toolbar } from '@mui/material';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import SetupWalletDialogContent from 'components/pages/Request/RequestAccess/SetupWalletDialogContent';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { Props } from 'types';

const SetupWalletButton: FC<Props> = ({ className = '' }) => {
  const [open, toggleOpen] = useToggle(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const doOpen = () => {
    toggleOpen(true);
  };

  const doClose = () => {
    toggleOpen(false);
    dispatch(setupWalletActions.setStep(NewWalletScreenStep.ChooseWalletPassword));
  };

  return (
    <>
      <Button size='large' onClick={doOpen} className={className}>
        {t<string>('Set up wallet')}
      </Button>
      <Dialog open={open} onClose={doClose} fullScreen={true}>
        <AppBar position='relative'>
          <Container maxWidth='sm' disableGutters>
            <Toolbar>
              <h5 className='mb-0 flex-1'>{t<string>('Set up new wallet')}</h5>
              <IconButton edge='start' color='inherit' onClick={doClose} aria-label='close'>
                <Close />
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth='sm' disableGutters>
          <DialogContent className='pt-0'>
            <SetupWalletDialogContent />
          </DialogContent>
        </Container>
      </Dialog>
    </>
  );
};

export default SetupWalletButton;
