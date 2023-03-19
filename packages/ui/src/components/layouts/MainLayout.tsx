import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import { Props } from 'types';
import MainFooter from './MainFooter';
import MainHeader from './MainHeader';

interface MainLayoutProps extends Props {
  headerActions?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ className = '', headerActions }: MainLayoutProps) => {
  return (
    <div className={`${className} flex flex-col min-h-[100vh]`}>
      <MainHeader headerActions={headerActions} />
      <main className='flex-1 my-4'>
        <Container maxWidth='sm'>
          <Outlet />
        </Container>
      </main>
      <MainFooter />
    </div>
  );
};

export default MainLayout;
