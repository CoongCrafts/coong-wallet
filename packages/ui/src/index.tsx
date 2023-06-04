import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';
import { CssBaseline, GlobalStyles } from '@mui/material';
import App from 'App';
import i18nInstance from 'i18n';
import LanguageProvider from 'providers/LanguageProvider';
import ThemeProvider from 'providers/ThemeProvider';
import { WalletStateProvider } from 'providers/WalletStateProvider';
import { persistor, store } from 'redux/store';
import { globalStyles } from 'styles';
import { ALERT_TIMEOUT } from 'utils/constants';

function fadeOut(el: HTMLElement | null) {
  if (!el) {
    return;
  }

  // @ts-ignore
  el.style.opacity = 1;

  (function fade() {
    // @ts-ignore
    if ((el.style.opacity -= 0.03) < 0) {
      el.style.display = 'none';
    } else {
      requestAnimationFrame(fade);
    }
  })();
}

fadeOut(document.getElementById('loading-overlay'));

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider i18nInstance={i18nInstance}>
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
        </LanguageProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
