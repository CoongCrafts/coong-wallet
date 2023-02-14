import React, { FC } from 'react';
import { Props } from 'types';

const InvalidRequest: FC<Props> = ({ className = '', reason }) => {
  return (
    <div className={`${className} text-center`}>
      <h2>Invalid Request</h2>
      {reason && <p>Reason: {reason}</p>}
      <p>If you open this page by accident, it's safe to close it now.</p>
    </div>
  );
};

export default InvalidRequest;
