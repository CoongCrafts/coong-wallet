import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useWalletState } from 'providers/WalletStateProvider';

export default function useAccountNameValidation(name: string, oldName?: string) {
  const { keyring } = useWalletState();
  const [validation, setValidation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let checkingTimeoutId: any;

    if (name.length > 16) {
      setValidation('Account name should not exceed 16 characters');
    } else if (name !== oldName) {
      checkingTimeoutId = setTimeout(async () => {
        try {
          setLoading(true);
          const isExisted = await keyring.existsName(name);
          setValidation(isExisted ? 'Account name is already picked' : '');
        } catch (e: any) {
          toast.error(e.message);
        }
        setLoading(false);
      }, 500);
    }

    return () => {
      clearTimeout(checkingTimeoutId);
      setValidation('');
    };
  }, [name]);

  return { validation, loading };
}
