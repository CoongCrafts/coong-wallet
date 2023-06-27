import { AccountsBackupSchema } from 'validations/AccountBackup';
import { array, number, object, string, tuple } from 'yup';

const DerivationPathRegex = /^\/\/(\d)+$/;

export const CompactAccountInfoSchema = tuple([
  string().label('DerivationPath').matches(DerivationPathRegex, { excludeEmptyString: true }),
  string().label('AccountName'),
]);

export const WalletInfoSchema = object({
  accountsIndex: number().integer(),
  encryptedMnemonic: string().required(),
});

export const WalletQrBackupSchema = WalletInfoSchema.concat(
  object({
    accounts: array()
      .of(CompactAccountInfoSchema)
      // When accountsIndex is not defined, meaning that this is a backup from setup wallet procedure
      // So accounts field is not required here
      // Schema is not required by default so do not need to specify not required
      .when('accountsIndex', {
        is: (value: any) => !!value,
        then: (schema) => schema.required(),
        otherwise: (schema) => schema,
      }),
  }),
);

export const WalletBackupSchema = WalletInfoSchema.concat(
  AccountsBackupSchema.when('accountsIndex', {
    is: (value: any) => !!value,
    then: (schema) => schema.required(),
    otherwise: (schema) =>
      // When accountsIndex is not defined, meaning that this is a backup from setup wallet procedure
      // So accounts field is not required here
      // Overwrite those fields to bypass this validation
      schema.concat(
        object({
          encoding: object(),
          encoded: string(),
        }),
      ),
  }),
);
