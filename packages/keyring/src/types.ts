import { KeyringPair$Meta } from '@polkadot/keyring/types';
import { KeypairType } from '@polkadot/util-crypto/types';

export interface AccountInfo extends KeyringPair$Meta {
  address: string; // Substrate generic address (prefix: 42)
  genesisHash?: string | null;
  isExternal?: boolean;
  isHardware?: boolean;
  isHidden?: boolean;
  name?: string;
  parentAddress?: string;
  suri?: string;
  type?: KeypairType;
  whenCreated?: number;
  index?: number; // TODO Add account index
}
