import { FC } from 'react';
import { Button } from '@mui/material';
import { Props } from 'types';

interface NoAccountsPlaceholder extends Props {
  query: string;
}

const NoAccountsPlaceholder: FC<NoAccountsPlaceholder> = ({ query }) => {
  const newAccountButton = document.querySelector<HTMLButtonElement>('button.new-account-btn');

  return (
    <div className='text-gray-500 mt-6 mb-12 text-center'>
      {query ? (
        <span>
          No accounts meet search query: <strong>{query}</strong>
        </span>
      ) : (
        <>
          <h5 className='mt-8'>No accounts found in wallet</h5>
          {newAccountButton && (
            <Button className='mt-4' onClick={() => newAccountButton.click()} variant='outlined'>
              Create your first account now!
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default NoAccountsPlaceholder;
