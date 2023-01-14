import { createTheme } from '@mui/material';

export default createTheme({
  typography: {
    fontFamily:
      "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',\n" +
      "  'Liberation Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
  },
  palette: {
    primary: {
      main: '#1A88DB',
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        variant: 'contained',
        sx: {
          textTransform: 'initial',
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
