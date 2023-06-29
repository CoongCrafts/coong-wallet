import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import SecretRecoveryPhrase from 'components/shared/SecretRecoveryPhrase';
import { Props } from 'types';

interface BackupSecretRecoveryPhraseProps extends Props {
  secretPhrase: string;
}

const BackupSecretRecoveryPhrase: FC<BackupSecretRecoveryPhraseProps> = ({ secretPhrase, className = '' }) => {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <h3>{t<string>('Finally, back up your secret recovery phrase')}</h3>
      <p className='mb-4'>{t<string>('Write down the below 12 words and keep it in a safe place.')}</p>
      <SecretRecoveryPhrase secretPhrase={secretPhrase} />
    </div>
  );
};

export default BackupSecretRecoveryPhrase;
