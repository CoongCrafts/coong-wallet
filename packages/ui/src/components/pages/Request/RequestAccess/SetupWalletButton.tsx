import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Close } from '@mui/icons-material';
import { AppBar, Button, Container, Dialog, DialogContent, IconButton, Toolbar } from '@mui/material';
import SetupWalletDialogContent from 'components/pages/Request/RequestAccess/SetupWalletDialogContent';
import useDialog from 'hooks/useDialog';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { Props } from 'types';

const SetupWalletButton: FC<Props> = ({ className = '' }) => {
  const { open, doOpen, doClose } = useDialog();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onClose = () => {
    doClose(() => dispatch(setupWalletActions.resetState()));
  };

  return (
    <>
      <Button size='large' onClick={doOpen} className={className}>
        {t<string>('Set up wallet')}
      </Button>
      <Dialog open={open} onClose={onClose} fullScreen={true}>
        <AppBar position='relative'>
          <Container maxWidth='sm' disableGutters>
            <Toolbar>
              <h5 className='mb-0 flex-1'>{t<string>('Set up new wallet')}</h5>
              <IconButton edge='start' color='inherit' onClick={onClose} aria-label='close'>
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
