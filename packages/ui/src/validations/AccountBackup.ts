import { array, object, string } from 'yup';

export const AccountInfoSchema = object({
  address: string().required(),
  meta: object(),
});

export const AccountBackupSchema = object({
  encoded: string().required(),
  encoding: object().required(),
}).concat(AccountInfoSchema);

export const AccountsBackupSchema = object({
  encoded: string().required(),
  encoding: object().required(),
  accounts: array().of(AccountInfoSchema),
});
