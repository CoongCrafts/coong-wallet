import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAsync } from 'react-use';
import { useWalletState } from '../providers/WalletStateProvider';

export default function useAccountNameValidation(name: string) {
  const { keyring } = useWalletState();
  const [validation, setValidation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useAsync(async () => {
    if (name.length > 16) {
      setValidation('Account name should not exceed 16 characters');
    } else {
      setLoading(true);
      try {
        const isExisted = await keyring.existsName(name);
        setValidation(isExisted ? 'Account name is already picked' : '');
      } catch (e: any) {
        toast.error(e.message);
      }
      setLoading(false);
    }
  }, [name]);

  return { validation, loading };
}
