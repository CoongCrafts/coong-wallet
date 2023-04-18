import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard, useToggle } from 'react-use';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Button } from '@mui/material';
import { Props } from 'types';

interface SecretRecoveryPhraseProps extends Props {
  secretPhrase: string;
}
const SecretRecoveryPhrase: FC<SecretRecoveryPhraseProps> = ({ className = '', secretPhrase }) => {
  const { t } = useTranslation();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useToggle(false);

  const doCopy = () => {
    copyToClipboard(secretPhrase);
    setCopied(true);

    // set the copy button label back to default label after 5s
    setTimeout(() => setCopied(false), 5e3);
  };

  return (
    <div className={className}>
      <div className='p-4 bg-black/10 dark:bg-white/15'>{secretPhrase}</div>
      <div className='bg-black/20 dark:bg-white/5 flex justify-end items-center'>
        <Button
          onClick={doCopy}
          variant='text'
          color='inherit'
          className='px-4 py-2 font-normal text-xs rounded-none disabled:text-inherit'
          disabled={copied}
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}>
          {copied ? t<string>('Copied') : t<string>('Copy to Clipboard')}
        </Button>
      </div>
    </div>
  );
};

export default SecretRecoveryPhrase;
