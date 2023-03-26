import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Button, CircularProgress, Menu, MenuItem } from '@mui/material';
import { settingsActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { Language, Props } from 'types';

const LanguageSelection: FC<Props> = () => {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const { language } = useSelector((state: RootState) => state.settings);
  const [loading, setLoading] = useState(i18n.resolvedLanguage !== language);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    if (i18n.resolvedLanguage === language) setLoading(false);
  }, [i18n.resolvedLanguage]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const switchLanguage = (language: Language) => {
    setAnchorEl(null);
    setLoading(true);
    dispatch(settingsActions.switchLanguage(language));
  };

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <div className='flex items-center'>
        <Button variant='contained' onClick={(e) => handleClick(e)} endIcon={<KeyboardArrowDown />} disabled={loading}>
          {language === Language.English && 'English'}
          {language === Language.Vietnamese && 'Vietnamese'}
        </Button>
        {loading && <CircularProgress size={20} thickness={8} className='ml-2' />}
      </div>
      <Menu open={open} anchorEl={anchorEl} onClose={() => handleClose()}>
        <MenuItem onClick={() => switchLanguage(Language.English)}>English</MenuItem>
        <MenuItem onClick={() => switchLanguage(Language.Vietnamese)}>Vietnamese</MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSelection;
