import { CircularProgress, InputAdornment, TextField } from '@mui/material';
import { StandardTextFieldProps } from '@mui/material/TextField/TextField';

interface LoadingTextFieldProps extends StandardTextFieldProps {
  loading: boolean;
}

export default function LoadingTextField({ loading, ...props }: LoadingTextFieldProps): JSX.Element {
  return (
    <TextField
      {...props}
      InputProps={{
        endAdornment: <InputAdornment position='end'>{loading && <CircularProgress size={20} />}</InputAdornment>,
      }}
    />
  );
}
