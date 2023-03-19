import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container, styled } from '@mui/material';
import LockWalletButton from 'components/shared/LockWalletButton';
import ResetWalletButton from 'components/shared/ResetWalletButton';
import SettingsWalletButton from 'components/shared/SettingsWalletButton';
import CoongTextLogo from 'components/shared/misc/CoongTextLogo';
import { Props } from 'types';
import MainFooter from './MainFooter';

interface MainLayoutProps extends Props {
  headerActions?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ className = '', headerActions }: MainLayoutProps) => {
  return (
    <div className={className}>
      <header className='main-header border-b border-black/10 dark:bg-header-dark dark:border-white/15'>
        <Container maxWidth='sm'>
          <div className='main-header__inner'>
            <CoongTextLogo />
            {headerActions && (
              <div className='main-header__actions'>
                {!import.meta.env.PROD && <ResetWalletButton />}
                <LockWalletButton />
                <SettingsWalletButton />
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
      <MainFooter />
    </div>
  );
};

export default styled(MainLayout)`
  .main-header {
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

    > div {
      display: flow-root;
      width: 100%;
      height: 100%;
    }
  }
`;
