import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Container, styled } from '@mui/material';
import CoongLogo from 'assets/images/coong-text-logo.svg';
import LockWalletButton from 'components/shared/LockWalletButton';
import ResetWalletButton from 'components/shared/ResetWalletButton';
import { Props } from 'types';

const MainLayout: React.FC<Props> = ({ className = '' }: Props) => {
  return (
    <div className={className}>
      <header className='main-header'>
        <Container maxWidth='sm'>
          <div className='main-header__inner'>
            <Link to='/'>
              <img src={CoongLogo} alt='Coong Wallet' height={36} />
            </Link>
            <div className='main-header__actions'>
              {!import.meta.env.PROD && <ResetWalletButton />}
              <LockWalletButton />
            </div>
          </div>
        </Container>
      </header>
      <main>
        <Container maxWidth='sm'>
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
    color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(10px);
    background-color: rgba(255, 255, 255, 0.8);

    img {
      height: 34px;
      display: block;
    }

    &__inner {
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__actions {
      flex-grow: 1;
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;

      &:empty {
        display: none;
      }
    }
  }

  main {
    padding: 1rem 0;
    flex: 1;

    > div {
      display: flow-root;
      width: 100%;
      height: 100%;
    }
  }
`;
