import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, styled } from '@mui/material';
import LockWalletButton from 'components/shared/LockWalletButton';
import ResetWalletButton from 'components/shared/ResetWalletButton';
import CoongTextLogo from 'components/shared/mics/CoongTextLogo';
import { Props } from 'types';

interface MainLayoutProps extends Props {
  headerActions?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ className = '', headerActions }: MainLayoutProps) => {
  return (
    <div className={className}>
      <header className='main-header'>
        <Container maxWidth='sm'>
          <div className='main-header__inner'>
            <CoongTextLogo />
            {headerActions && (
              <div className='main-header__actions'>
                {!import.meta.env.PROD && <ResetWalletButton />}
                <LockWalletButton />
              </div>
            )}
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
