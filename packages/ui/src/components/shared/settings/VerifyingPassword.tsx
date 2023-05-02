import { FC } from 'react';
import { useDispatch } from 'react-redux';
import VerifyingPasswordForm from 'components/shared/forms/VerifyingPasswordForm';
import { settingsDialogActions } from 'redux/slices/settings-dialog';
import { Props } from 'types';

interface VerifyingPasswordProps extends Props {
  continueButtonLabel?: string;
}

const VerifyingPassword: FC<VerifyingPasswordProps> = ({ continueButtonLabel = 'Continue' }) => {
  const dispatch = useDispatch();

  const onPasswordVerified = async (password: string) => {
    dispatch(settingsDialogActions.setVerifiedPassword(password));
  };

  const doBack = () => {
    dispatch(settingsDialogActions.resetState());
  };

  return (
    <VerifyingPasswordForm
      onPasswordVerified={onPasswordVerified}
      onBack={doBack}
      continueButtonLabel={continueButtonLabel}
    />
  );
};

export default VerifyingPassword;
