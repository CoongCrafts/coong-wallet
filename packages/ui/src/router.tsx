import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import MainLayout from 'components/layouts/MainLayout';
import Embed from 'components/pages/Embed';
import MainScreen from 'components/pages/MainScreen';
import Request from 'components/pages/Request';
import NewWallet from 'components/pages/SetupWallet/NewWallet';
import RestoreWallet from 'components/pages/SetupWallet/RestoreWallet';

export default createBrowserRouter(
  createRoutesFromElements([
    <Route path='/' element={<MainLayout headerActions={true} />}>
      <Route index element={<MainScreen />} />
      <Route path='/new-wallet' element={<NewWallet />} />
      <Route path='/restore-wallet' element={<RestoreWallet />} />
    </Route>,
    <Route path='/embed' element={<Embed />} />,
    <Route path='/request' element={<MainLayout />}>
      <Route index element={<Request />} />
    </Route>,
  ]),
);
