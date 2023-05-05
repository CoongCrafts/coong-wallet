import QrCodeIcon from '@mui/icons-material/QrCode';
import { IconButton } from '@mui/material';
import { AccountInfoExt, Props } from 'types';
import { EventName, triggerEvent } from 'utils/eventemitter';

interface ShowAddressQrCodeButtonProps extends Props {
  account: AccountInfoExt;
}

function ShowAddressQrCodeButton({ className = '', account }: ShowAddressQrCodeButtonProps): JSX.Element {
  const handleClick = () => {
    triggerEvent(EventName.OpenShowAddressQrCodeDialog, account);
  };

  return (
    <IconButton onClick={handleClick} className={className}>
      <QrCodeIcon />
    </IconButton>
  );
}

export default ShowAddressQrCodeButton;
