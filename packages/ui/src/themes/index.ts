import { createTheme, PaletteMode } from '@mui/material';

const newTheme = (mode: PaletteMode) =>
  createTheme({
    breakpoints: {
      values: {
        xs: 450,
        sm: 600,
        md: 900,
        lg: 1200,
        xl: 1536,
      },
    },
    typography: {
      fontFamily:
        "'Nunito Sans', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',\n" +
        "  'Liberation Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
    },
    palette: {
      mode: mode,
      primary: {
        main: '#1A88DB',
      },
      ...(mode === 'dark'
        ? {
            text: {
              primary: '#f0f0f0',
            },
            background: {
              default: '#313131',
            },
          }
        : {}),
    },
    components: {
      MuiButton: {
        defaultProps: {
          disableRipple: true,
          variant: 'contained',
          sx: {
            textTransform: 'initial',
            fontWeight: 700,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
      },
      MuiTooltip: {
        defaultProps: {
          placement: 'top',
          arrow: true,
        },
      },
    },
  });

export default newTheme;
