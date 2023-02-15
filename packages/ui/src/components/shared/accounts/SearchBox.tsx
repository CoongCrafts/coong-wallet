import { FC } from 'react';
import { Search } from '@mui/icons-material';
import { InputAdornment, TextField } from '@mui/material';
import { Props } from 'types';

interface SearchBoxProps extends Props {
  onChange: (query: string) => void;
  placeholder?: string;
}

const SearchBox: FC<SearchBoxProps> = ({ className = '', onChange, placeholder = 'Search by name' }) => {
  return (
    <div className={className}>
      <TextField
        hiddenLabel
        size='small'
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Search fontSize='small' />
            </InputAdornment>
          ),
          className: 'pl-2 h-[30px] text-[0.8125rem]',
        }}
        placeholder={placeholder}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
};
export default SearchBox;
