import { FC, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "redux/store";
import { ThemeProvider as MuiThemeProvider } from "@mui/material";
import theme from ".";
import { Props } from "types";
import { ThemeMode } from "redux/slices/settings";

const ThemeProvider: FC<Props> = ({children}) => {
  const { themeMode } = useSelector((state: RootState) => state.settings);

  const themeColor = useMemo(() => {
    switch (themeMode) {
      case ThemeMode.Dark: 
        return 'dark';
      case ThemeMode.Light:
        return 'light';
      case ThemeMode.System:
      default:
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  }, [themeMode]);

  return (
    <MuiThemeProvider theme={theme(themeColor)}>
      <div className={themeColor}>
        { children }
      </div>
    </MuiThemeProvider>
  )
}

export default ThemeProvider;