import { FC } from 'react';
import { Props } from 'types';
import { styled } from '@mui/material';
import ChooseWalletPassword from 'components/pages/NewWallet/ChooseWalletPassword';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { NewWalletScreenStep } from 'components/pages/NewWallet/types';
import ConfirmWalletPassword from 'components/pages/NewWallet/ConfirmWalletPassword';
import BackupSecretRecoveryPhrase from 'components/pages/NewWallet/BackupSecretRecoveryPhrase';

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
  return (
    <div className={className}>
      <ScreenStep />
    </div>
  );
};

export default styled(NewWallet)`
  max-width: 450px;
  margin: 4rem auto;

  form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-actions {
    display: flex;
    flex-direction: row;
    gap: 1rem;
  }
`;
