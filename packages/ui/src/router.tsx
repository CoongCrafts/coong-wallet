import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import MainLayout from 'components/layouts/MainLayout';
import Embed from 'components/pages/Embed';
import MainScreen from 'components/pages/MainScreen';
import NewWallet from 'components/pages/NewWallet';

export default createBrowserRouter(
  createRoutesFromElements([
    <Route path='/' element={<MainLayout headerActions={true} />}>
      <Route index element={<MainScreen />} />
      <Route path='/new-wallet' element={<NewWallet />} />
    </Route>,
    <Route path='/embed' element={<Embed />} />,
  ]),
);
