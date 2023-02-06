import { WalletRequestWithResolver } from '@coong/base/types';
import { Props } from 'types';

export interface RequestProps extends Props {
  message: WalletRequestWithResolver;
}
