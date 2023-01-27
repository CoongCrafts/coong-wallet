import { FC } from 'react';
import { styled } from '@mui/material';
import { Props } from 'types';


const PageTitle: FC<Props> = ({ className = '', children }) => {
  return <div className={className}>{children}</div>;
};

export default styled(PageTitle)`
  font-size: 1.5rem;
  font-weight: bold;
`;
