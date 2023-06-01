import { KeyringPair$Json, KeyringPair$Meta } from '@polkadot/keyring/types';
import { KeyringPairs$Json } from '@polkadot/ui-keyring/types';
import { KeypairType } from '@polkadot/util-crypto/types';

export type DerivationPath = `//${string}` | '';
export type AccountName = string;

export interface AccountInfo extends KeyringPair$Meta {
  address: string; // Substrate generic address (prefix: 42)
  genesisHash?: string | null;
  isExternal?: boolean;
  isHardware?: boolean;
  isHidden?: boolean;
  name?: AccountName;
  type?: KeypairType;
  whenCreated?: number;
  derivationPath?: DerivationPath;
  originalHash?: string;
}

export type CompactAccountInfo = [DerivationPath, AccountName];

export interface QrBackup {}

export interface JsonBackup {}

export interface WalletBackup$Json {
  accountsIndex: number;
  encryptedMnemonic: string;
}

export interface WalletBackup extends KeyringPairs$Json, WalletBackup$Json {}

export interface AccountBackup extends KeyringPair$Json, JsonBackup, QrBackup {}

export interface WalletQrBackup extends WalletBackup$Json, QrBackup {
  accounts: CompactAccountInfo[];
}
