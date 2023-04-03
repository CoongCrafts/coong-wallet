import { FC } from 'react';
import DetailRow, { DetailRowProps } from 'components/pages/Request/RequestSigning/DetailRow';
import { Props } from 'types';

interface RequestDetails extends Props {
  rows: DetailRowProps[];
}

const RequestDetails: FC<RequestDetails> = ({ className = '', rows }) => {
  return (
    <div className={`${className}`}>
      {rows.map((row) => (
        <DetailRow key={row.name} {...row} />
      ))}
    </div>
  );
};

export default RequestDetails;
