import React, { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardArrowDown } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Menu, MenuItem } from '@mui/material';
import useAnchorEl from 'hooks/useAnchorEl';
import useThemeMode from 'hooks/useThemeMode';
import { settingsActions } from 'redux/slices/settings';
import { RootState } from 'redux/store';
import { Language, Props } from 'types';

const LanguageOptions: { [key in Language]: string } = {
  [Language.English]: 'English',
};

const LanguageSelection: FC<Props> = () => {
  const dispatch = useDispatch();
  const {
    i18n: { resolvedLanguage },
  } = useTranslation();
  const { language } = useSelector((state: RootState) => state.settings);
  const [loading, setLoading] = useState(resolvedLanguage !== language);
  const [anchorEl, setAnchorEl, open] = useAnchorEl();
  const { dark } = useThemeMode();

  useEffect(() => {
    if (resolvedLanguage === language) setLoading(false);
  }, [resolvedLanguage]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const switchLanguage = (language: Language) => {
    setAnchorEl(null);
    if (language === resolvedLanguage) return null;
    setLoading(true);
    dispatch(settingsActions.switchLanguage(language));
  };

  return (
    <>
      <LoadingButton
        variant='outlined'
        color={dark ? 'grayLight' : 'gray'}
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        disabled={loading}
        loading={loading}
        className='flex justify-between xs:min-w-[200px] min-w-full'>
        {LanguageOptions[language]}
      </LoadingButton>

      <Menu open={open} anchorEl={anchorEl} onClose={handleClose}>
        {Object.entries(LanguageOptions).map(([lang, label]) => (
          <MenuItem key={lang} onClick={() => switchLanguage(lang as Language)}>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelection;
