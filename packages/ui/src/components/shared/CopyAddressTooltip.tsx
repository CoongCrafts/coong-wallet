import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCopyToClipboard } from 'react-use';
import { Tooltip } from '@mui/material';
import { Props } from 'types';
import { isTouchDevice } from 'utils/device';

interface AddressCopiedTooltipProps extends Props {
  address: string;
  name?: string;
}

const touchDevice = isTouchDevice();

const CopyAddressTooltip: FC<AddressCopiedTooltipProps> = ({ address, name, children }) => {
  const { t } = useTranslation();
  const [_, copyToClipboard] = useCopyToClipboard();
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(t<string>('Click to copy address'));

  const doCopy = () => {
    copyToClipboard(address);
    setTitle(t<string>('Address copied!'));

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
      setTitle(t<string>('Click to copy address'));
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
