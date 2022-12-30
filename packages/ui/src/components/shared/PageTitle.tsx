import { FC } from 'react';
import { Props } from 'types';
import { styled } from '@mui/material';

interface PageTitleProps extends Props {
  title: string;
}

const PageTitle: FC<PageTitleProps> = ({ className = '', title }) => {
  return <div className={className}>{title}</div>;
};

export default styled(PageTitle)`
  font-size: 1.5rem;
  font-weight: bold;
`;
