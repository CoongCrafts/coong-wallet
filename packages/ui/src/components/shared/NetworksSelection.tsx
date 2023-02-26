import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { networks } from '@coong/base';
import { NetworkInfo } from '@coong/base/types';
import { Autocomplete, TextField } from '@mui/material';
import { appActions } from 'redux/slices/app';
import { RootState } from 'redux/store';
import { Props } from 'types';

const NetworksSelection: FC<Props> = () => {
  const dispatch = useDispatch();
  const { addressPrefix } = useSelector((state: RootState) => state.app);
  const [network, setNetwork] = useState<NetworkInfo>(networks.find((one) => one.prefix === addressPrefix)!);

  useEffect(() => {
    dispatch(appActions.updateAddressPrefix(network.prefix));
  }, [network]);

  return (
    <Autocomplete
      disableClearable
      value={network}
      onChange={(event, newNetwork) => {
        newNetwork && setNetwork(newNetwork);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          size='small'
          label='Address format'
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off',
            className: `${params.inputProps.className} w-full sm:w-[180px]`,
          }}
        />
      )}
      getOptionLabel={(option) => option.displayName}
      options={networks}
      blurOnSelect
    />
  );
};

export default NetworksSelection;
