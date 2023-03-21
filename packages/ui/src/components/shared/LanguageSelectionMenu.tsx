import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Button, Menu, MenuItem } from '@mui/material';
import { settingActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { Language, Props } from 'types';

const LanguageSelectionMenu: FC<Props> = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state: RootState) => state.settings);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const switchLanguage = (language: Language) => {
    setAnchorEl(null);
    dispatch(settingActions.switchLanguage(language));
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <div>
      <Button variant='contained' onClick={(e) => handleClick(e)} endIcon={<KeyboardArrowDown />}>
        {language === Language.English && 'English'}
      </Button>
      <Menu open={open} anchorEl={anchorEl} onClose={() => handleClose()}>
        <MenuItem onClick={() => switchLanguage(Language.English)}>English</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSelectionMenu;
