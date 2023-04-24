import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChooseWalletPassword from 'components/pages/SetupWallet/ChooseWalletPassword';
import ConfirmWalletPassword from 'components/pages/SetupWallet/ConfirmWalletPassword';
import BackupSecretRecoveryPhrase from 'components/pages/SetupWallet/NewWallet/BackupSecretRecoveryPhrase';
import useOnWalletInitialized from 'hooks/wallet/useOnWalletInitialized';
import { useWalletSetup } from 'providers/WalletSetupProvider';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { NewWalletScreenStep, Props } from 'types';

const ScreenStep: FC<Props> = () => {
  const dispatch = useDispatch();
  const { newWalletScreenStep } = useSelector((state: RootState) => state.setupWallet);
  const { onCancelSetup } = useWalletSetup();

  const goto = (step: NewWalletScreenStep) => {
    return () => dispatch(setupWalletActions.setNewWalletScreenStep(step));
  };

  switch (newWalletScreenStep) {
    case NewWalletScreenStep.ConfirmWalletPassword:
      return (
        <ConfirmWalletPassword
          nextStep={goto(NewWalletScreenStep.BackupSecretRecoveryPhrase)}
          prevStep={goto(NewWalletScreenStep.ChooseWalletPassword)}
        />
      );
    case NewWalletScreenStep.BackupSecretRecoveryPhrase:
      return <BackupSecretRecoveryPhrase />;
    default:
      return (
        <ChooseWalletPassword prevStep={onCancelSetup} nextStep={goto(NewWalletScreenStep.ConfirmWalletPassword)} />
      );
  }
};

const NewWallet: FC<Props> = ({ className = '' }) => {
  useOnWalletInitialized();

  return (
    <div className={`${className} max-w-[450px] mt-8 mb-16 mx-auto`}>
      <ScreenStep />
    </div>
  );
};

export default NewWallet;
