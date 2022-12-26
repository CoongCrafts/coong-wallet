import { createTheme } from '@mui/material';

export default createTheme({
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        variant: 'contained',
      },
    },
  },
});
