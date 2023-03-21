import { FC, useState } from 'react';
import { useCopyToClipboard } from 'react-use';
import { Tooltip } from '@mui/material';
import i18next from 'i18next';
import { Props } from 'types';
import { isTouchDevice } from 'utils/device';

interface AddressCopiedTooltipProps extends Props {
  address: string;
  name?: string;
}

const touchDevice = isTouchDevice();
const CLICK_TO_COPY = i18next.t<string>('Click to copy address');
const ADDRESS_COPIED = i18next.t<string>('Address copied!');

const CopyAddressTooltip: FC<AddressCopiedTooltipProps> = ({ address, name, children }) => {
  const [_, copyToClipboard] = useCopyToClipboard();
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(CLICK_TO_COPY);

  const doCopy = () => {
    copyToClipboard(address);
    setTitle(ADDRESS_COPIED);

    if (touchDevice) {
      setOpen(true);
      setTimeout(() => {
        setOpen(false);
      }, 1000);
    }
  };

  if (touchDevice) {
    return (
      <Tooltip title={title} disableHoverListener={touchDevice} open={open}>
        <div onClick={doCopy} style={{ cursor: 'copy' }}>
          {children}
        </div>
      </Tooltip>
    );
  } else {
    const onOpen = () => {
      setTitle(CLICK_TO_COPY);
    };

    return (
      <Tooltip title={title} onOpen={onOpen}>
        <div onClick={doCopy} style={{ cursor: 'copy' }}>
          {children}
        </div>
      </Tooltip>
    );
  }
};

export default CopyAddressTooltip;
