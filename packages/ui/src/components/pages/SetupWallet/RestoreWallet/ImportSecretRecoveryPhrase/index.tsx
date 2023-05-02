import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChooseWalletPassword from 'components/pages/SetupWallet/ChooseWalletPassword';
import ConfirmWalletPassword from 'components/pages/SetupWallet/ConfirmWalletPassword';
import EnterSecretRecoveryPhrase from 'components/pages/SetupWallet/RestoreWallet/ImportSecretRecoveryPhrase/EnterSecretRecoveryPhrase';
import useSetupWallet from 'hooks/wallet/useSetupWallet';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { RestoreWalletScreenStep } from 'types';

export default function ImportSecretRecoveryPhrase(): JSX.Element {
  const dispatch = useDispatch();
  const { secretPhrase, password, restoreWalletScreenStep } = useSelector((state: RootState) => state.setupWallet);
  const { setup, loading } = useSetupWallet({ secretPhrase, password });

  const goto = (step: RestoreWalletScreenStep) => {
    return () => dispatch(setupWalletActions.setRestoreWalletScreenStep(step));
  };

  switch (restoreWalletScreenStep) {
    case RestoreWalletScreenStep.ConfirmWalletPassword:
      return (
        <ConfirmWalletPassword
          nextStep={setup}
          nextStepLabel='Finish'
          nextStepLoading={loading}
          prevStep={goto(RestoreWalletScreenStep.ChooseWalletPassword)}
          heading='Lastly, confirm your wallet password'
        />
      );
    case RestoreWalletScreenStep.ChooseWalletPassword:
      return (
        <ChooseWalletPassword
          nextStep={goto(RestoreWalletScreenStep.ConfirmWalletPassword)}
          prevStep={goto(RestoreWalletScreenStep.EnterSecretRecoveryPhrase)}
          heading='Next, choose your wallet password'
        />
      );
    case RestoreWalletScreenStep.EnterSecretRecoveryPhrase:
    default:
      return <EnterSecretRecoveryPhrase />;
  }
}
