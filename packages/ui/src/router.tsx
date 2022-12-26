import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import MainLayout from 'components/layouts/MainLayout';
import Welcome from 'components/pages/Welcome';

export default createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<Welcome />} />
    </Route>,
  ),
);
