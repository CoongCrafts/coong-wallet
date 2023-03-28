import { PaletteColor, PaletteColorOptions } from '@mui/material/styles/createPalette';

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    gray: PaletteColor;
    grayLight: PaletteColor;
  }
  interface PaletteOptions {
    gray?: PaletteColorOptions;
    grayLight?: PaletteColorOptions;
  }
}

declare module '@mui/material/Button/Button' {
  interface ButtonPropsColorOverrides {
    gray: true;
    grayLight: true;
  }
}
