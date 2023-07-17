import { useSelector } from 'react-redux';
import ImportJsonFile from 'components/pages/SetupWallet/RestoreWallet/ImportJsonFile';
import ImportSecretRecoveryPhrase from 'components/pages/SetupWallet/RestoreWallet/ImportSecretRecoveryPhrase';
import MethodSelection from 'components/pages/SetupWallet/RestoreWallet/MethodSelection';
import ScanQrCode from 'components/pages/SetupWallet/RestoreWallet/ScanQrCode';
import useOnWalletInitialized from 'hooks/wallet/useOnWalletInitialized';
import { RootState } from 'redux/store';
import { WalletRecoveryMethod } from 'types';

function RestoreWalletContent() {
  const { restoreWalletMethod } = useSelector((state: RootState) => state.setupWallet);

  switch (restoreWalletMethod) {
    case WalletRecoveryMethod.SecretRecoveryPhrase:
      return <ImportSecretRecoveryPhrase />;
    case WalletRecoveryMethod.QrCode:
      return <ScanQrCode />;
    case WalletRecoveryMethod.JsonFile:
      return <ImportJsonFile />;
    default:
      return <MethodSelection />;
  }
}

export default function RestoreWallet(): JSX.Element {
  useOnWalletInitialized();

  return (
    <div className='max-w-[450px] mt-8 mb-16 mx-auto'>
      <RestoreWalletContent />
    </div>
  );
}
