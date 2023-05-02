import { createContext, FC, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Props } from 'types';

interface WalletSetupContextProps {
  onWalletSetup: () => void; // triggered when the wallet is set up successfully
  onCancelSetup: () => void; // triggered when cancel the setup by go back or hit cancel
}

export const WalletSetupContext = createContext<WalletSetupContextProps | null>(null);

export const useWalletSetup = () => {
  const navigate = useNavigate();
  const context = useContext(WalletSetupContext);

  if (context) {
    return context;
  } else {
    const goHome = () => navigate('/');

    return {
      onWalletSetup: goHome,
      onCancelSetup: goHome,
    };
  }
};

interface SetupWalletProviderProps extends WalletSetupContextProps, Props {}

export const WalletSetupProvider: FC<SetupWalletProviderProps> = ({ onWalletSetup, onCancelSetup, children }) => {
  return <WalletSetupContext.Provider value={{ onWalletSetup, onCancelSetup }}>{children}</WalletSetupContext.Provider>;
};
