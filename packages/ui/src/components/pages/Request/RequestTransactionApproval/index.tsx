import { FC, useRef, useState } from 'react';
import { Form } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TypeRegistry } from '@polkadot/types';
import { ExtrinsicEra } from '@polkadot/types/interfaces';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { bnToBn, formatNumber, hexToNumber } from '@polkadot/util';
import { keyring, state } from '@coong/base';
import { WalletRequestWithResolver } from '@coong/base/types';
import { assert } from '@coong/utils';
import { Button, TextField } from '@mui/material';
import AccountCard from 'components/pages/Accounts/AccountCard';
import { Props } from 'types';

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

interface RequestTransactionApprovalProps extends Props {
  message: WalletRequestWithResolver;
}

const registry = new TypeRegistry();

const RequestTransactionApproval: FC<RequestTransactionApprovalProps> = ({ className, message }) => {
  const [password, setPassword] = useState<string>('');
  const { origin, request } = message;

  const payloadJSON = request.body as SignerPayloadJSON;

  const pair = keyring.getSigningPair(payloadJSON.address);
  assert(pair, 'Account not found');

  const targetAccount = { address: pair.address, ...pair.meta };
  const { genesisHash, specVersion: hexSpec, nonce, version, method, blockNumber } = payloadJSON;
  const specVersion = useRef(bnToBn(hexSpec)).current;

  registry.setSignedExtensions(payloadJSON.signedExtensions);
  const { era } = registry.createType('ExtrinsicPayload', payloadJSON, { version: payloadJSON.version });

  const approveTransaction = async () => {
    try {
      await state.approveSignExtrinsic(password);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const cancelRequest = () => {
    state.cancelSignExtrinsic();
  };

  return (
    <div className={className}>
      <h2 className='text-center'>Approve Transaction Request</h2>
      <p>You are approving a transaction with account</p>
      <AccountCard account={targetAccount} />
      <div className='my-4'>
        <div>
          <span>from: </span>
          <strong>{origin}</strong>
        </div>
        <div>
          <span>genesis: </span>
          <strong className='break-all'>{genesisHash}</strong>
        </div>
        <div>
          <span>version: </span>
          <strong>{specVersion.toNumber()}</strong>
        </div>
        <div>
          <span>nonce: </span>
          <strong>{hexToNumber(nonce)}</strong>
        </div>
        <div>
          <span>version: </span>
          <strong>{version}</strong>
        </div>
        <div>
          <span>method data: </span>
          <strong className='break-all'>{method}</strong>
        </div>
        <div>
          <span>life time: </span>
          <strong>{mortalityAsString(era, blockNumber)}</strong>
        </div>
      </div>

      <Form className='mt-4' onSubmit={approveTransaction}>
        <TextField
          label='Wallet password'
          size='medium'
          type='password'
          fullWidth
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <div className='flex mt-4 gap-4'>
          <Button size='large' variant='text' color='warning' onClick={cancelRequest}>
            Cancel
          </Button>
          <Button size='large' fullWidth disabled={!password} type='submit'>
            Approve Transaction
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RequestTransactionApproval;
