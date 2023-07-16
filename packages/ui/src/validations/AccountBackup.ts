import { array, object, string } from 'yup';

export const AccountInfoSchema = object({
  address: string().required(),
  meta: object(),
});

export const AccountBackupSchema = AccountInfoSchema.concat(
  object({
    encoded: string().required(),
    encoding: object().required(),
  }),
);

export const AccountsBackupSchema = object({
  accounts: array().of(AccountInfoSchema),
  // The encoded field is required when restoring accounts,
  // So if accounts field has been defined then the encoded field is compulsory.
  encoded: string().when('accounts', { is: (value: any) => !!value, then: (schema) => schema.required() }),
  encoding: object(),
});
