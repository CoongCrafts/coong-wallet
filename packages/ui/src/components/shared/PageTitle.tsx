import { FC } from 'react';
import { Props } from 'types';
import { styled } from '@mui/material';

const PageTitle: FC<Props> = ({ className = '', children }) => {
  return <div className={className}>{children}</div>;
};

export default styled(PageTitle)`
  font-size: 1.5rem;
  font-weight: bold;
`;
