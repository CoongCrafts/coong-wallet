import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import BackupSecretRecoveryPhrase from 'components/pages/NewWallet/BackupSecretRecoveryPhrase';
import ChooseWalletPassword from 'components/pages/NewWallet/ChooseWalletPassword';
import ConfirmWalletPassword from 'components/pages/NewWallet/ConfirmWalletPassword';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import { useWalletState } from 'contexts/WalletStateContext';
import { RootState } from 'redux/store';
import { Props } from 'types';

interface NewWalletProps extends Props {
  onWalletSetup?: () => void;
}

const ScreenStep: FC<NewWalletProps> = ({ onWalletSetup }) => {
  const { newWalletScreenStep } = useSelector((state: RootState) => state.setupWallet);

  switch (newWalletScreenStep) {
    case NewWalletScreenStep.ConfirmWalletPassword:
      return <ConfirmWalletPassword />;
    case NewWalletScreenStep.BackupSecretRecoveryPhrase:
      return <BackupSecretRecoveryPhrase onWalletSetup={onWalletSetup} />;
    default:
      return <ChooseWalletPassword />;
  }
};

const NewWallet: FC<NewWalletProps> = ({ className = '', onWalletSetup }) => {
  const { keyring } = useWalletState();
  const navigate = useNavigate();

  useEffectOnce(() => {
    keyring.initialized().then((initialized) => {
      if (initialized) {
        if (onWalletSetup) {
          onWalletSetup();
        } else {
          navigate('/');
        }
      }
    });
  });

  return (
    <div className={`${className} max-w-[450px] mt-8 mb-16 mx-auto`}>
      <ScreenStep onWalletSetup={onWalletSetup} />
    </div>
  );
};

export default NewWallet;
