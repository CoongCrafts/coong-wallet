import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { useEffectOnce } from 'react-use';
import { encodeAddress } from '@polkadot/util-crypto';
import { Dialog, DialogContent } from '@mui/material';
import AccountAddress from 'components/pages/Accounts/AccountAddress';
import DialogTitle from 'components/shared/DialogTitle';
import NetworksSelection from 'components/shared/NetworksSelection';
import useDialog from 'hooks/useDialog';
import useQrCode from 'hooks/useQrCode';
import { AccountInfoExt } from 'types';
import { EventName, EventRegistry } from 'utils/eventemitter';

export default function ShowAddressQrCodeDialog(): JSX.Element {
  const { open, doOpen, doClose } = useDialog();
  const { ref, size } = useQrCode();
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleNetworkChange = (addressPrefix: number) => {
    setAddress(encodeAddress(address, addressPrefix));
  };

  const onOpen = (account: AccountInfoExt) => {
    setAddress(account.networkAddress);
    setName(account.name!);
    doOpen();
  };

  useEffectOnce(() => {
    EventRegistry.on(EventName.OpenShowAddressQrCodeDialog, onOpen);
    return () => {
      EventRegistry.off(EventName.OpenShowAddressQrCodeDialog, onOpen);
    };
  });

  const onClose = () => {
    doClose(() => {
      setAddress('');
      setName('');
    });
  };

  if (!address || !name) return <></>;

  return (
    <Dialog ref={ref} open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>{`Account address: ${name}`}</DialogTitle>
      <DialogContent className='pb-8 flex gap-4 flex-col items-center'>
        <NetworksSelection onNetworkChange={handleNetworkChange} className='mt-4 xs:w-3/4 w-full' />
        <QRCodeCanvas value={address} includeMargin size={size} />
        <AccountAddress address={address} className='text-base' />
      </DialogContent>
    </Dialog>
  );
}
