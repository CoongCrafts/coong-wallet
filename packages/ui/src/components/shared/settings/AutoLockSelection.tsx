import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Menu, Button, MenuItem } from '@mui/material';
import useAnchorEl from 'hooks/useAnchorEl';
import useThemeMode from 'hooks/useThemeMode';
import { settingsActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { Props, AutoLockInterval } from 'types';

const AutoLockTimerOptions: { [key in AutoLockInterval]: string } = {
  [AutoLockInterval.FiveMinutes]: '5 minutes',
  [AutoLockInterval.FifteenMinutes]: '15 minutes',
  [AutoLockInterval.ThirtyMinutes]: '30 minutes',
};

const AutoLockSelection: FC<Props> = () => {
  const { autoLockInterval } = useSelector((state: RootState) => state.settings);
  const [anchorEl, setAnchorEl, open] = useAnchorEl();
  const { dark } = useThemeMode();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const switchAutoLockTimer = (time: AutoLockInterval) => {
    setAnchorEl(null);
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
        {t<string>(AutoLockTimerOptions[autoLockInterval])}
      </Button>
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
        {Object.entries(AutoLockTimerOptions).map(([time, label]) => (
          <MenuItem key={time} onClick={() => switchAutoLockTimer(Number(time) as AutoLockInterval)}>
            {t<string>(label)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AutoLockSelection;
