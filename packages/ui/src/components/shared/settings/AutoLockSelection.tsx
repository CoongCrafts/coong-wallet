import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';
import useMenuDropdown from 'hooks/useMenuDropdown';
import useThemeMode from 'hooks/useThemeMode';
import { settingsActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { AutoLockInterval, Props } from 'types';

export const AutoLockTimerOptions = [
  {
    interval: AutoLockInterval.FiveMinutes,
    label: '5 minutes',
  },
  {
    interval: AutoLockInterval.FifteenMinutes,
    label: '15 minutes',
  },
  {
    interval: AutoLockInterval.ThirtyMinutes,
    label: '30 minutes',
  },
];

const AutoLockSelection: FC<Props> = () => {
  const { autoLockInterval } = useSelector((state: RootState) => state.settings);
  const { open, anchorEl, doOpen, doClose } = useMenuDropdown();
  const { dark } = useThemeMode();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    doOpen(event.currentTarget);
  };

  const switchAutoLockTimer = (time: AutoLockInterval) => {
    doClose();
    dispatch(settingsActions.switchAutoLockInterval(time));
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant='outlined'
        color={dark ? 'grayLight' : 'gray'}
        className='flex justify-between xs:min-w-[200px] min-w-full'
        endIcon={<KeyboardArrowDown />}>
        {t<string>(AutoLockTimerOptions.find(({ interval }) => interval === autoLockInterval)!.label)}
      </Button>
      <Menu open={open} onClose={doClose} anchorEl={anchorEl}>
        {AutoLockTimerOptions.map(({ interval, label }) => (
          <MenuItem key={interval} onClick={() => switchAutoLockTimer(interval)}>
            {t<string>(label)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AutoLockSelection;
