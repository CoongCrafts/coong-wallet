import { FC } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { keyring } from '@coong/base';
import BackupSecretRecoveryPhrase from 'components/pages/NewWallet/BackupSecretRecoveryPhrase';
import ChooseWalletPassword from 'components/pages/NewWallet/ChooseWalletPassword';
import ConfirmWalletPassword from 'components/pages/NewWallet/ConfirmWalletPassword';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import { RootState } from 'redux/store';
import { Props } from 'types';

const ScreenStep = () => {
  const { newWalletScreenStep } = useSelector((state: RootState) => state.setupWallet);

  switch (newWalletScreenStep) {
    case NewWalletScreenStep.ConfirmWalletPassword:
      return <ConfirmWalletPassword />;
    case NewWalletScreenStep.BackupSecretRecoveryPhrase:
      return <BackupSecretRecoveryPhrase />;
    default:
      return <ChooseWalletPassword />;
  }
};

const NewWallet: FC<Props> = ({ className = '' }: Props) => {
  const navigate = useNavigate();

  useEffectOnce(() => {
    keyring.initialized().then(() => {
      navigate('/');
    });
  });

  return (
    <div className={`${className} max-w-[450px] my-16 mx-auto`}>
      <ScreenStep />
    </div>
  );
};

export default NewWallet;
