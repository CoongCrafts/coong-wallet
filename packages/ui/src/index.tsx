import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import reportWebVitals from 'reportWebVitals';
import light from 'themes/light';
import { globalStyles } from 'styles';
import { RouterProvider } from 'react-router-dom';
import router from 'router';
import { Provider } from 'react-redux';
import { store } from 'redux/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={light}>
        <CssBaseline />
        <GlobalStyles styles={globalStyles} />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
