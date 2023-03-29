import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Menu, Button, MenuItem } from '@mui/material';
import useThemeMode from '../../../hooks/useThemeMode';
import { settingsActions } from '../../../redux/slices/settings';
import { RootState } from '../../../redux/store';
import { Props, AutoLockInterval } from '../../../types';

const AutoLockTimerOptions: { [key in AutoLockInterval]: string } = {
  [AutoLockInterval.FiveMinutes]: '5 minutes',
  [AutoLockInterval.FifteenMinutes]: '15 minutes',
  [AutoLockInterval.ThirtyMinutes]: '30 minutes',
};

const AutoLockSelection: FC<Props> = () => {
  const { autoLockInterval } = useSelector((state: RootState) => state.settings);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { dark } = useThemeMode();
  const dispatch = useDispatch();
  const open = Boolean(anchorEl);

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
        {AutoLockTimerOptions[autoLockInterval]}
      </Button>
      <Menu open={open} onClose={handleClose} anchorEl={anchorEl}>
        {Object.entries(AutoLockTimerOptions).map(([time, label]) => (
          <MenuItem onClick={() => switchAutoLockTimer(Number(time) as AutoLockInterval)}>{label}</MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default AutoLockSelection;
