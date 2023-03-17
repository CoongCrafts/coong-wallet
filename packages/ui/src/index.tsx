import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PersistGate } from 'redux-persist/integration/react';
import { CssBaseline, GlobalStyles } from '@mui/material';
import App from 'App';
import { WalletStateProvider } from 'contexts/WalletStateContext';
import ThemeProvider from 'providers/ThemeProvider';
import { persistor, store } from 'redux/store';
import { globalStyles } from 'styles';
import { ALERT_TIMEOUT } from 'utils/constants';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <WalletStateProvider>
            <CssBaseline />
            <GlobalStyles styles={globalStyles} />
            <App />
            <ToastContainer
              position='top-center'
              closeOnClick
              pauseOnHover
              theme='colored'
              autoClose={ALERT_TIMEOUT}
              hideProgressBar
              limit={2}
            />
          </WalletStateProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
