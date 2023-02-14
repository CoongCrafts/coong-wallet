import { FC } from 'react';
import { Props } from 'types';

const PageTitle: FC<Props> = ({ className = '', children }) => {
  return <div className={`${className} text-2xl font-bold`}>{children}</div>;
};

export default PageTitle;
