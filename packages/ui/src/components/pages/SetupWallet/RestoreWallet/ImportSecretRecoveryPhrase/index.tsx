import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChooseWalletPassword from 'components/pages/SetupWallet/ChooseWalletPassword';
import ConfirmWalletPassword from 'components/pages/SetupWallet/ConfirmWalletPassword';
import EnterSecretRecoveryPhrase from 'components/pages/SetupWallet/RestoreWallet/ImportSecretRecoveryPhrase/EnterSecretRecoveryPhrase';
import useSetupWallet from 'hooks/wallet/useSetupWallet';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { Props, RestoreWalletScreenStep } from 'types';


interface RestoreWalletProps extends Props {
  onWalletSetup?: () => void;
}

const ScreenStep: FC<RestoreWalletProps> = ({ onWalletSetup }) => {
  const dispatch = useDispatch();
  const { secretPhrase, password, restoreWalletScreenStep } = useSelector((state: RootState) => state.setupWallet);
  const { setup, loading } = useSetupWallet({ secretPhrase, password, onWalletSetup });

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
        />
      );
    case RestoreWalletScreenStep.ChooseWalletPassword:
      return (
        <ChooseWalletPassword
          nextStep={goto(RestoreWalletScreenStep.ConfirmWalletPassword)}
          prevStep={goto(RestoreWalletScreenStep.EnterSecretRecoveryPhrase)}
        />
      );
    case RestoreWalletScreenStep.EnterSecretRecoveryPhrase:
    default:
      return <EnterSecretRecoveryPhrase />;
  }
};

const ImportSecretRecoveryPhrase: FC<RestoreWalletProps> = ({ className = '', onWalletSetup }) => {
  return (
    <div className={`${className} max-w-[450px] mt-8 mb-16 mx-auto`}>
      <ScreenStep onWalletSetup={onWalletSetup} />
    </div>
  );
};

export default ImportSecretRecoveryPhrase;
