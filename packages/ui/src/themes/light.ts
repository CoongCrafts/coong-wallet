import { createTheme } from '@mui/material';

export default createTheme({
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
