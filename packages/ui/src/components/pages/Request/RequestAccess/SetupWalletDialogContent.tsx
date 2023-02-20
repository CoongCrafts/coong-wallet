import { FC, useState } from 'react';
import NewWallet from 'components/pages/NewWallet';
import Welcome from 'components/pages/Welcome';
import { Props } from 'types';

enum ViewStep {
  WELCOME,
  CREATE_NEW_WALLET,
  RESTORE_WALLET,
}

const SetupWalletDialogContent: FC<Props> = () => {
  const [viewStep, setViewStep] = useState<ViewStep>(ViewStep.WELCOME);

  switch (viewStep) {
    case ViewStep.CREATE_NEW_WALLET:
      return <NewWallet onWalletSetup={() => {}} />;
    default:
      return <Welcome onCreateNewWallet={() => setViewStep(ViewStep.CREATE_NEW_WALLET)} />;
  }
};

export default SetupWalletDialogContent;
