import { AccountsBackupSchema } from 'validations/AccountBackup';
import { array, number, object, string, tuple } from 'yup';

const DerivationPathRegex = /^\/\/(\d)+$/;

export const CompactAccountInfoSchema = tuple([
  string().label('DerivationPath').matches(DerivationPathRegex, { excludeEmptyString: true }),
  string().label('AccountName'),
]);

export const WalletInfoSchema = object({
  accountsIndex: number().integer().required(),
  encryptedMnemonic: string().required(),
});

export const WalletQrBackupSchema = WalletInfoSchema.concat(
  object({
    accounts: array().of(CompactAccountInfoSchema),
  }),
);

export const WalletBackupSchema = WalletInfoSchema.concat(AccountsBackupSchema);
