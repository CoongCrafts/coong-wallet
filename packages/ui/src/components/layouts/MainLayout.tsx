import React from 'react';
import { Props } from 'types';
import { Container, styled } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import CoongLogo from 'assets/images/coong-logo.png';

const MainLayout: React.FC<Props> = ({ className = '' }: Props) => {
  return (
    <div className={className}>
      <header className='main-header'>
        <Container>
          <Link to='/'>
            <img src={CoongLogo} alt='Coong Wallet' />
          </Link>
        </Container>
      </header>
      <main>
        <Container>
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

  header.main-header {
    background-color: #f5f5f5;

    .MuiContainer-root {
      height: 64px;
      display: flex;
      align-items: center;
    }

    img {
      height: 28px;
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
