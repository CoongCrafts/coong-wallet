import { FC, useState } from 'react';
import NewWallet from 'components/pages/SetupWallet/NewWallet';
import RestoreWallet from 'components/pages/SetupWallet/RestoreWallet';
import Welcome from 'components/pages/Welcome';
import { WalletSetupProvider } from 'providers/WalletSetupProvider';
import { Props } from 'types';

enum ViewStep {
  WELCOME,
  CREATE_NEW_WALLET,
  RESTORE_WALLET,
}

const SetupWalletDialogContent: FC<Props> = () => {
  const [viewStep, setViewStep] = useState<ViewStep>(ViewStep.WELCOME);

  const onWalletSetup = () => {};
  const onCancelSetup = () => {
    setViewStep(ViewStep.WELCOME);
  };

  const renderContent = () => {
    switch (viewStep) {
      case ViewStep.CREATE_NEW_WALLET:
        return <NewWallet />;
      case ViewStep.RESTORE_WALLET:
        return <RestoreWallet />;
      default:
        return (
          <Welcome
            onCreateNewWallet={() => setViewStep(ViewStep.CREATE_NEW_WALLET)}
            onRestoreExistingWallet={() => setViewStep(ViewStep.RESTORE_WALLET)}
          />
        );
    }
  };

  return (
    <WalletSetupProvider onWalletSetup={onWalletSetup} onCancelSetup={onCancelSetup}>
      {renderContent()}
    </WalletSetupProvider>
  );
};

export default SetupWalletDialogContent;
