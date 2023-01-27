import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, styled } from '@mui/material';
import { Props } from 'types';


const Welcome: React.FC<Props> = ({ className = '' }: Props) => {
  const navigate = useNavigate();

  const doCreateNewWallet = () => {
    navigate('/new-wallet');
  };

  const doRestoreWallet = () => {
    toast.info('Coming soon!');
  };

  return (
    <div className={className}>
      <div className='welcome'>
        <h2>Welcome to Coong</h2>
        <p>
          A multichain crypto wallet
          <br />
          for <strong>Polkadot & Kusama</strong> ecosystem
        </p>
      </div>
      <div className='setup-wallet'>
        <h4>Set up your Coong wallet now</h4>

        <div className='wallet-buttons-group'>
          <Button size='large' onClick={doCreateNewWallet}>
            Create new wallet
          </Button>
          <Button variant='outlined' size='large' onClick={doRestoreWallet} disabled={true}>
            Restore existing wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default styled(Welcome)`
  margin: 3rem auto;
  text-align: center;

  h2 {
    margin-bottom: 0.5rem;
  }

  .setup-wallet {
    margin-top: 2rem;

    h4 {
      margin-bottom: 0.7rem;
    }
  }

  .wallet-buttons-group {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    justify-content: center;
    align-items: center;

    button {
      min-width: 270px;
    }
  }
`;
