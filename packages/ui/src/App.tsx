import React from 'react';
import { Button } from '@mui/material';

function App() {
  return (
    <div className='app'>
      <img src='images/coong-logo.png' alt='Coong' height={28} />
      <h1>Coong Wallet</h1>
      <Button>Set up new wallet</Button>
    </div>
  );
}

export default App;
