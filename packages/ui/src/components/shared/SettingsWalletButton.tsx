import { Button, ButtonGroup, Dialog, DialogContent, DialogContentText, IconButton } from "@mui/material";
import React, { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "redux/store";
import { Props } from "types";
import SettingsIcon from '@mui/icons-material/Settings';
import { settingActions, ThemeMode } from "redux/slices/settings";
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import DialogTitle from "components/shared/DialogTitle";


const SettingsWalletButton: FC<Props> = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { themeMode } = useSelector((state: RootState) => state.settings);
  const { seedReady, locked } = useSelector((state: RootState) => state.app);

  if (!seedReady || locked) {
    return null;
  }

  const handleClose = () => setOpen(false);
  const switchThemeMode = (mode: ThemeMode) => {
    dispatch(settingActions.switchThemeMode(mode));
  }

  return (
    <>
      <IconButton size='small' title='Open settings' onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
        <DialogTitle onClose={handleClose}>Settings</DialogTitle>
        <DialogContent>
          <DialogContentText>Themes</DialogContentText>
            <ButtonGroup className="" fullWidth >
              <Button 
                variant={themeMode == ThemeMode.Dark ? 'contained' : 'outlined'}
                onClick={() => switchThemeMode(ThemeMode.Dark)}>
                  <DarkModeIcon className="px-0.5" />
                  Dark
              </Button>
              <Button 
                variant={themeMode == ThemeMode.Light ? 'contained' : 'outlined'}
                onClick={() => switchThemeMode(ThemeMode.Light)}>
                  <LightModeIcon className="px-0.5" />
                  Light
                </Button>
              <Button 
                variant={themeMode == ThemeMode.System ? 'contained' : 'outlined'}
                onClick={() => switchThemeMode(ThemeMode.System)}>
                  <SettingsBrightnessIcon className="px-0.5" />
                  System
              </Button>
            </ButtonGroup>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SettingsWalletButton;