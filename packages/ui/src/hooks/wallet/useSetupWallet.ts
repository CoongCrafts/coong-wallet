import { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToggle } from 'react-use';
import { StandardCoongError } from '@coong/utils';
import { useWalletState } from '../../providers/WalletStateProvider';
import { appActions } from '../../redux/slices/app';

interface SetupWalletOptions {
  secretPhrase?: string;
  password?: string;
  onWalletSetup?: () => void;
}

export default function useSetupWallet({ secretPhrase, password, onWalletSetup }: SetupWalletOptions) {
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const dispatch = useDispatch();
  const [loading, setLoading] = useToggle(false);
  const navigate = useNavigate();

  const setup = () => {
    if (!secretPhrase || !password) {
      throw new StandardCoongError('Secret recovery phrase or password are missing');
    }

    setLoading(true);

    setTimeout(async () => {
      await keyring.initialize(secretPhrase!, password);
      await keyring.createNewAccount(t<string>('My first account'), password);

      dispatch(appActions.seedReady());
      dispatch(appActions.unlock());

      if (onWalletSetup) {
        onWalletSetup();
      } else {
        navigate('/');
      }
    }, 500); // intentionally!
  };

  return {
    setup,
    loading,
  };
}
