import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Close, Search } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import clsx from 'clsx';
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
  const { t } = useTranslation();
  const [query, setQuery] = useState<string>('');

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
            <IconButton
              edge='end'
              onClick={doClearSearchQuery}
              className={size === 'xs' ? 'p-1 mr-[-7px]' : 'p-0.5 mr-[-10px]'}>
              {query ? <Close fontSize='small' /> : <Search fontSize='small' />}
            </IconButton>
          </InputAdornment>
        ),
        className: clsx({ 'h-[30px] text-[0.8125rem]': size === 'xxs' }),
      }}
      label={xxs ? '' : t<string>(label)}
      hiddenLabel={xxs}
      placeholder={xxs ? t<string>(label) : ''}
      className={className}
      onChange={(event) => {
        setQuery(event.target.value);
      }}
      autoFocus={autoFocus}
    />
  );
};
export default SearchBox;
