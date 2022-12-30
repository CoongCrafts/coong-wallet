import React from 'react';
import { Props } from 'types';
import { Container, styled } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import CoongLogo from 'assets/images/coong-logo.png';
import LockWalletButton from 'components/shared/LockWalletButton';

const MainLayout: React.FC<Props> = ({ className = '' }: Props) => {
  return (
    <div className={className}>
      <header className='main-header'>
        <Container maxWidth='md'>
          <div className='main-header__inner'>
            <Link to='/'>
              <img src={CoongLogo} alt='Coong Wallet' />
            </Link>
            <LockWalletButton />
          </div>
        </Container>
      </header>
      <main>
        <Container maxWidth='md'>
          <Outlet />
        </Container>
      </main>
    </div>
  );
};

export default styled(MainLayout)`
  display: flex;
  flex-direction: column;
  height: 100%;

  .main-header {
    background-color: #f5f5f5;

    img {
      height: 28px;
      display: block;
    }

    &__inner {
      height: 64px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  main {
    margin-top: 1rem;
    flex: 1;

    > div {
      display: flow-root;
      width: 100%;
      height: 100%;
    }
  }
`;
