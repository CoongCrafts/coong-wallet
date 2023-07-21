import { QRCodeCanvas } from 'qrcode.react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { encodeAddress } from '@polkadot/util-crypto';
import { Dialog, DialogContent } from '@mui/material';
import CoongLogo from 'assets/images/coong-logo-circle.png';
import AccountAddress from 'components/pages/Accounts/AccountAddress';
import DialogTitle from 'components/shared/DialogTitle';
import NetworksSelection from 'components/shared/NetworksSelection';
import useDialog from 'hooks/useDialog';
import useQrCodeSize from 'hooks/useQrCodeSize';
import useRegisterEvent from 'hooks/useRegisterEvent';
import { AccountInfoExt } from 'types';
import { EventName } from 'utils/eventemitter';

export default function ShowAddressQrCodeDialog(): JSX.Element {
  const { t } = useTranslation();
  const { open, doOpen, doClose } = useDialog();
  const { containerRef, size } = useQrCodeSize();
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');

  const handleNetworkChange = (addressPrefix: number) => {
    setAddress(encodeAddress(address, addressPrefix));
  };

  const onOpen = (account: AccountInfoExt) => {
    setAddress(account.networkAddress);
    setName(account.name ?? '');
    doOpen();
  };

  useRegisterEvent(EventName.OpenShowAddressQrCodeDialog, onOpen);

  const onClose = () => {
    doClose(() => {
      setAddress('');
      setName('');
    });
  };

  if (!address) return <></>;

  return (
    <Dialog ref={containerRef} open={open} onClose={onClose}>
      <DialogTitle onClose={onClose}>{`${t<string>('Account address')}: ${name}`}</DialogTitle>
      <DialogContent className='flex dark:gap-8 gap-2 mb-4 flex-col items-center overflow-hidden'>
        <NetworksSelection onNetworkChange={handleNetworkChange} className='mt-4 xs:w-3/4 w-full' />
        <QRCodeCanvas
          value={address}
          includeMargin
          size={size}
          title={t<string>('Account Address QR Code')}
          className='p-4'
          imageSettings={{
            src: CoongLogo,
            height: 45,
            width: 45,
            excavate: false,
          }}
        />
        <AccountAddress address={address} className='text-sm' />
      </DialogContent>
    </Dialog>
  );
}
