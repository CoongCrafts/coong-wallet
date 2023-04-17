import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'react-use';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from '@mui/material';
import { Props } from 'types';

interface SecretRecoveryPhraseProps extends Props {
  secretPhrase: string;
}
const SecretRecoveryPhrase: FC<SecretRecoveryPhraseProps> = ({ className = '', secretPhrase }) => {
  const { t } = useTranslation();
  const [copyButtonLabel, setCopyButtonLabel] = useState<string>('Copy to Clipboard');
  const [_, copyToClipboard] = useCopyToClipboard();

  const doCopy = () => {
    copyToClipboard(secretPhrase);
    setCopyButtonLabel('Copied!');
    setTimeout(() => setCopyButtonLabel('Copy to Clipboard'), 5e3);
  };

  return (
    <div className={className}>
      <div className='p-4 bg-black/10 dark:bg-white/15'>{secretPhrase}</div>
      <div className='bg-black/20 dark:bg-white/5 flex justify-end items-center'>
        <Button
          onClick={doCopy}
          variant='text'
          color='inherit'
          className='px-4 py-3 font-normal text-xs rounded-none disabled:text-inherit'
          disabled={copyButtonLabel === 'Copied!'}
          startIcon={copyButtonLabel === 'Copied!' ? <CheckIcon /> : <ContentCopyIcon />}>
          {t<string>(copyButtonLabel)}
        </Button>
      </div>
    </div>
  );
};

export default SecretRecoveryPhrase;
