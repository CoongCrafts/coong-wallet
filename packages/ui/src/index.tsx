import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import App from 'App';
import { store } from 'redux/store';
import { globalStyles } from 'styles';
import light from 'themes/light';
import { ALERT_TIMEOUT } from 'utils/constants';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={light}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <App />
        <ToastContainer
          position='top-right' // TODO move to bottom right on mobile
          closeOnClick
          pauseOnHover
          theme='colored'
          autoClose={ALERT_TIMEOUT}
          hideProgressBar
        />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
