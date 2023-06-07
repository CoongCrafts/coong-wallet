import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAsync } from 'react-use';
import { useWalletState } from 'providers/WalletStateProvider';

export default function useAccountNameValidation(name: string, oldName?: string) {
  const { keyring } = useWalletState();
  const [validation, setValidation] = useState<string>('');

  useAsync(async () => {
    if (!name) return;
    if (name.length > 16) {
      setValidation('Account name should not exceed 16 characters');
    } else if (name !== oldName) {
      try {
        const isExisted = await keyring.existsName(name);
        setValidation(isExisted ? 'Account name is already picked' : '');
      } catch (e: any) {
        toast.error(e.message);
      }
    }
    return () => {
      setValidation('');
    };
  }, [name]);

  return { validation };
}
