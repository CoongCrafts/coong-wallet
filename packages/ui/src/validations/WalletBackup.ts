import { AccountsBackupSchema } from 'validations/AccountBackup';
import { array, number, object, string, tuple } from 'yup';

const DerivationPathRegex = /^\/\/(\d)+$/;

export const CompactAccountInfoSchema = tuple([
  string().label('DerivationPath').matches(DerivationPathRegex, { excludeEmptyString: true }),
  string().label('AccountName'),
]);

export const CompactWalletInfoSchema = object({
  accountsIndex: number().integer().required(),
  encryptedMnemonic: string().required(),
});

export const WalletQrBackupSchema = CompactWalletInfoSchema.concat(
  object({
    accounts: array().of(CompactAccountInfoSchema),
  }),
);

export const WalletBackupSchema = CompactWalletInfoSchema.concat(AccountsBackupSchema);
