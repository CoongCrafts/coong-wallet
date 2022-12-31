import { FC } from 'react';
import { Props } from 'types';
import { Tooltip } from '@mui/material';
import { useCopyToClipboard } from 'react-use';
import { toast } from 'react-toastify';

interface AddressCopiedTooltipProps extends Props {
  address: string;
  name?: string;
}

const CopyAddressTooltip: FC<AddressCopiedTooltipProps> = ({ address, name, children }) => {
  const [_, copyToClipboard] = useCopyToClipboard();

  const doCopy = () => {
    copyToClipboard(address);
    toast.success(name ? `${name}'s address copied` : 'Address copied');
  };

  return (
    <Tooltip title='Click to copy address'>
      <div onClick={doCopy} style={{ cursor: 'copy' }}>
        {children}
      </div>
    </Tooltip>
  );
};

export default CopyAddressTooltip;
