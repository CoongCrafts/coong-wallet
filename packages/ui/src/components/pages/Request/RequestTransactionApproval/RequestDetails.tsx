import { FC } from 'react';
import { TypeRegistry } from '@polkadot/types';
import { ExtrinsicEra } from '@polkadot/types/interfaces';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn, formatNumber, hexToNumber } from '@polkadot/util';
import clsx from 'clsx';
import { RequestProps } from 'components/pages/Request/types';

function mortalityAsString(era: ExtrinsicEra, hexBlockNumber: string): string {
  if (era.isImmortalEra) {
    return 'Immortal';
  }

  const blockNumber = bnToBn(hexBlockNumber);
  const mortal = era.asMortalEra;
  const birth = formatNumber(mortal.birth(blockNumber));
  const death = formatNumber(mortal.death(blockNumber));

  return `Mortal, valid from ${birth} to ${death}`;
}

const registry = new TypeRegistry();

interface DetailLine {
  name: string;
  value: any;
  breakWord?: boolean;
}

const RequestDetails: FC<RequestProps> = ({ className, message }) => {
  const { origin, request } = message;

  const payloadJSON = request.body as SignerPayloadJSON;

  const { genesisHash, specVersion, nonce, method, blockNumber } = payloadJSON;

  registry.setSignedExtensions(payloadJSON.signedExtensions);
  const { era } = registry.createType('ExtrinsicPayload', payloadJSON, { version: payloadJSON.version });

  const requestDetails: DetailLine[] = [
    {
      name: 'from',
      value: origin,
      breakWord: true,
    },
    {
      name: 'genesis',
      value: genesisHash,
      breakWord: true,
    },
    {
      name: 'version',
      value: bnToBn(specVersion).toNumber(),
    },
    {
      name: 'nonce',
      value: hexToNumber(nonce),
    },
    {
      name: 'method data',
      value: method,
      breakWord: true,
    },
    {
      name: 'life time',
      value: mortalityAsString(era, blockNumber),
    },
  ];

  return (
    <div className={`${className}`}>
      {requestDetails.map(({ name, value, breakWord }) => (
        <div key={name} className='flex items-start mb-2 gap-2' data-testid={`row-${name.replace(' ', '-')}`}>
          <div className='text-gray-500 dark:text-gray-200 min-w-[100px] text-right'>{name}: </div>
          <div>
            <strong className={clsx({ 'break-all': breakWord })}>{value}</strong>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestDetails;
