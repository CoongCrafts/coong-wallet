import { useSelector } from 'react-redux';
import ImportSecretRecoveryPhrase from 'components/pages/SetupWallet/RestoreWallet/ImportSecretRecoveryPhrase';
import MethodSelection from 'components/pages/SetupWallet/RestoreWallet/MethodSelection';
import ScanQrCode from 'components/pages/SetupWallet/RestoreWallet/ScanQrCode';
import useOnWalletInitialized from 'hooks/wallet/useOnWalletInitialized';
import { RootState } from 'redux/store';
import { RestoreWalletMethod } from 'types';

function RestoreWalletContent() {
  const { restoreWalletMethod } = useSelector((state: RootState) => state.setupWallet);

  switch (restoreWalletMethod) {
    case RestoreWalletMethod.SecretRecoveryPhrase:
      return <ImportSecretRecoveryPhrase />;
    case RestoreWalletMethod.QrCode:
      return <ScanQrCode />;
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
