import { AppInfo } from '@coong/base/requests/WalletState';
import { useWalletState } from 'providers/WalletStateProvider';

interface DappAccessItemProps {
  appInfo: AppInfo;
}
export default function DappAccessItem({ appInfo }: DappAccessItemProps): JSX.Element {
  const { walletState } = useWalletState();
  const { id, name, url, authorizedAccounts } = appInfo;
  const appId = id || walletState.extractAppId(url);

  return (
    <div className='border border-black/10 dark:border-white/15 py-2 px-4 rounded flex flex-row items-center gap-4 bg-zinc-50 dark:bg-black/15'>
      <div className='flex-grow'>
        <div className='flex flex-row items-center gap-4'>
          <img src={`https://icon.horse/icon/${appId}`} alt={`${name} icon`} width='18' />
          <div className='flex flex-col'>
            <div className='font-semibold'>{name}</div>
            <div className='text-gray-500 dark:text-gray-300 text-sm'>{appId}</div>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <div className='text-primary font-semibold text-2xl'>{authorizedAccounts.length}</div>
      </div>
    </div>
  );
}
