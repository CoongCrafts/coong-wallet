import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import CoongLogo from 'assets/images/coong-text-logo.svg';
import { Props } from 'types';

const CoongTextLogo: FC<Props> = () => {
  return (
    <Link to='/'>
      <img src={CoongLogo} alt='Coong Wallet' height={36} />
    </Link>
  );
};

export default CoongTextLogo;
