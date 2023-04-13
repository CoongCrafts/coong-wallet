import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChooseWalletPassword from 'components/pages/SetupWallet/ChooseWalletPassword';
import ConfirmWalletPassword from 'components/pages/SetupWallet/ConfirmWalletPassword';
import BackupSecretRecoveryPhrase from 'components/pages/SetupWallet/NewWallet/BackupSecretRecoveryPhrase';
import { NewWalletScreenStep } from 'components/pages/SetupWallet/types';
import useOnWalletInitialized from 'hooks/wallet/useOnWalletInitialized';
import { setupWalletActions } from 'redux/slices/setup-wallet';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface NewWalletProps extends Props {
  onWalletSetup?: () => void;
}

const ScreenStep: FC<NewWalletProps> = ({ onWalletSetup }) => {
  const dispatch = useDispatch();
  const { newWalletScreenStep } = useSelector((state: RootState) => state.setupWallet);

  const goto = (step: NewWalletScreenStep) => {
    return () => dispatch(setupWalletActions.setStep(step));
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
      return <BackupSecretRecoveryPhrase onWalletSetup={onWalletSetup} />;
    default:
      return <ChooseWalletPassword nextStep={goto(NewWalletScreenStep.ConfirmWalletPassword)} />;
  }
};

const NewWallet: FC<NewWalletProps> = ({ className = '', onWalletSetup }) => {
  useOnWalletInitialized(onWalletSetup);

  return (
    <div className={`${className} max-w-[450px] mt-8 mb-16 mx-auto`}>
      <ScreenStep onWalletSetup={onWalletSetup} />
    </div>
  );
};

export default NewWallet;
