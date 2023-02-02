import { KeyringPair$Meta } from '@polkadot/keyring/types';
import { KeypairType } from '@polkadot/util-crypto/types';

export interface AccountInfo extends KeyringPair$Meta {
  address: string;
  genesisHash?: string | null;
  isExternal?: boolean;
  isHardware?: boolean;
  isHidden?: boolean;
  name?: string;
  parentAddress?: string;
  suri?: string;
  type?: KeypairType;
  whenCreated?: number;
}
