import { FC, useEffect, useState } from 'react';
import { Close, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import clsx from 'clsx';
import useThemeMode from 'hooks/useThemeMode';
import { Props } from 'types';

interface SearchBoxProps extends Props {
  onChange: (query: string) => void;
  label?: string;
  autoFocus?: boolean;
  size?: 'xxs' | 'xs';
}

const SearchBox: FC<SearchBoxProps> = ({
  className = '',
  onChange,
  label = 'Search by name',
  autoFocus = false,
  size = 'xs',
}) => {
  const [query, setQuery] = useState<string>('');
  const themeMode = useThemeMode();

  useEffect(() => {
    onChange(query);
  }, [query]);

  const doClearSearchQuery = () => {
    setQuery('');
  };

  const xxs = size === 'xxs';

  return (
    <TextField
      size='small'
      value={query}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton edge='end' onClick={doClearSearchQuery}>
              {query ? <Close /> : <Search />}
            </IconButton>
          </InputAdornment>
        ),
        className: clsx({ 'h-[30px] text-[0.8125rem]': size === 'xxs' }),
      }}
      label={xxs ? '' : label}
      hiddenLabel={xxs}
      placeholder={xxs ? label : ''}
      className={className}
      onChange={(event) => {
        setQuery(event.target.value);
      }}
      autoFocus={autoFocus}
    />
  );
};
export default SearchBox;
