import { FC, useState } from 'react';
import NewWallet from 'components/pages/SetupWallet/NewWallet';
import Welcome from 'components/pages/Welcome';
import { Props } from 'types';
import RestoreWallet from '../../SetupWallet/RestoreWallet';

enum ViewStep {
  WELCOME,
  CREATE_NEW_WALLET,
  RESTORE_WALLET,
}

const SetupWalletDialogContent: FC<Props> = () => {
  const [viewStep, setViewStep] = useState<ViewStep>(ViewStep.WELCOME);

  const onWalletSetup = () => {};

  switch (viewStep) {
    case ViewStep.CREATE_NEW_WALLET:
      return <NewWallet onWalletSetup={onWalletSetup} />;
    case ViewStep.RESTORE_WALLET:
      return <RestoreWallet onWalletSetup={onWalletSetup} />;
    default:
      return (
        <Welcome
          onCreateNewWallet={() => setViewStep(ViewStep.CREATE_NEW_WALLET)}
          onRestoreExistingWallet={() => setViewStep(ViewStep.RESTORE_WALLET)}
        />
      );
  }
};

export default SetupWalletDialogContent;
