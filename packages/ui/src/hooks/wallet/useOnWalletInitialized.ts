import { useNavigate } from 'react-router-dom';
import { useEffectOnce } from 'react-use';
import { useWalletState } from 'providers/WalletStateProvider';

export default function useOnWalletInitialized(onWalletSetup?: () => void) {
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
}
