import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import light from 'themes/light';
import { globalStyles } from 'styles';
import { RouterProvider } from 'react-router-dom';
import router from 'router';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import { ToastContainer } from 'react-toastify';
import { ALERT_TIMEOUT } from 'utils/constants';
import 'react-toastify/dist/ReactToastify.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={light}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <RouterProvider router={router} />
        <ToastContainer
          position='bottom-right'
          closeOnClick
          pauseOnHover
          theme='light'
          autoClose={ALERT_TIMEOUT}
          hideProgressBar
        />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);
