import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAsync } from 'react-use';
import { useWalletState } from 'providers/WalletStateProvider';

export default function useAccountNameValidation(name: string, oldName?: string) {
  const { t } = useTranslation();
  const { keyring } = useWalletState();
  const [validation, setValidation] = useState<string>('');

  useAsync(async () => {
    if (name.length > 16) {
      setValidation(t<string>('Account name should not exceed 16 characters'));
    } else if (!!name && name !== oldName && (await keyring.existsName(name))) {
      setValidation(t<string>('Account name is already picked'));
    } else {
      setValidation('');
    }

    return () => {
      setValidation('');
    };
  }, [name]);

  return { validation };
}
