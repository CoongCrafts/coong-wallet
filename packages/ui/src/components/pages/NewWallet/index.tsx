import { FC } from 'react';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material';
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
