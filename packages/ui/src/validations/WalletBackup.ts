import { array, number, object, string, tuple } from 'yup';

const DerivationPathRegex = /^\/\/(\d)+$/;

export const CompactAccountInfoSchema = tuple([
  string().label('DerivationPath').matches(DerivationPathRegex),
  string().label('AccountName'),
]);

export const WalletQrBackupScheme = object({
  accountsIndex: number().integer().required(),
  encryptedMnemonic: string().required(),
  accounts: array().of(CompactAccountInfoSchema),
});
