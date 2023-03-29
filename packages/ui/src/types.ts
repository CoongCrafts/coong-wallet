import { ReactNode } from 'react';
import { AccountInfo } from '@coong/keyring/types';

export interface Props {
  className?: string;
  children?: ReactNode;
  [prop: string]: any;
}

export interface AccountInfoExt extends AccountInfo {
  networkAddress: string; // Network address changing following the `addressPrefix`
}

export enum ThemeMode {
  Dark = 'dark',
  Light = 'light',
  System = 'system',
}

export enum Language {
  English = 'en',
}

export enum AutoLockInterval {
  FiveMinutes = 5 * 60 * 1e3,
  FifteenMinutes = 15 * 60 * 1e3,
  ThirtyMinutes = 30 * 60 * 1e3,
}
