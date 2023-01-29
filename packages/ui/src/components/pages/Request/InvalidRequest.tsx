import React, { FC } from 'react';
import { styled } from '@mui/material';
import { Props } from 'types';

const InvalidRequest: FC<Props> = ({ className = '', reason }) => {
  return (
    <div className={className}>
      <h2>Invalid Request</h2>
      {reason && <p>Reason: {reason}</p>}
      <p>If you open this page by accident, it's safe to close it now.</p>
    </div>
  );
};

export default styled(InvalidRequest)`
  text-align: center;

  button {
    min-width: 150px;
  }
`;
