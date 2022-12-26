import { Button, styled } from '@mui/material';
import React from 'react';
import { Props } from 'types';

const Welcome: React.FC<Props> = ({ className = '' }: Props) => {
  const doCreateNewWallet = () => {
    console.log('new account');
  };

  return (
    <div className={className}>
      <div>
        <h1>
          A multichain wallet
          <br />
          for Polkadot & Kusama ecosystem
        </h1>
      </div>
      <div>
        <h2>Set up your SubProfile Wallet</h2>

        <div className='wallet-buttons-group'>
          <Button size='large' onClick={doCreateNewWallet}>
            Create new wallet
          </Button>
          <Button variant='outlined' size='large'>
            Restore existing wallet
          </Button>
        </div>
      </div>
    </div>
  );
};

export default styled(Welcome)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5rem auto;

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
