import { ReactNode } from 'react';

export interface Props {
  className?: string;
  children?: ReactNode;
  [prop: string]: any;
}
