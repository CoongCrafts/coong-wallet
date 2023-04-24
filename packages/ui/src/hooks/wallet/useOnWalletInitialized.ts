import { useAsync, useEffectOnce } from 'react-use';
import { useWalletSetup } from 'providers/WalletSetupProvider';
import { useWalletState } from 'providers/WalletStateProvider';

export default function useOnWalletInitialized() {
  const { keyring } = useWalletState();
  const { onWalletSetup } = useWalletSetup();

  useAsync(async () => {
    if (await keyring.initialized()) {
      onWalletSetup();
    }
  });
}
