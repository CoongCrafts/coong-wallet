import { CoongError, ErrorCode } from '@coong/utils';
import { EmbedHandler } from 'requests/EmbedHandler';
import TabHandler from 'requests/TabHandler';
import WalletState from 'requests/WalletState';
import { RequestName, WalletRequestMessage, WalletResponse } from 'types';
import { isMessageId } from 'utils/messageId';

export const state = new WalletState();
export const embedHandler = new EmbedHandler(state);
export const tabHandler = new TabHandler(state);

export async function handleWalletRequest<TRequestName extends RequestName>(
  message: WalletRequestMessage<TRequestName>,
): Promise<WalletResponse<TRequestName>> {
  const {
    id,
    request: { name },
  } = message;

  if (isMessageId(id)) {
    if (name.startsWith('tab/')) {
      return tabHandler.handle(message);
    } else if (name.startsWith('embed/')) {
      return embedHandler.handle(message);
    }
  }

  throw new CoongError(ErrorCode.UnknownRequest);
}
