import { object, string } from 'yup';

export const AccountBackupScheme = object({
  encoded: string().required(),
  address: string().required(),
  encoding: object().required(),
  meta: object(),
});
