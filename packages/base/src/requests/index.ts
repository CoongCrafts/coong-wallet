import { CoongError, ErrorCode } from '@coong/utils';
import { EmbedHandler } from 'requests/EmbedHandler';
import TabHandler from 'requests/TabHandler';
import WalletState from 'requests/WalletState';
import { MessageId, RequestName, WalletRequest, WalletResponse } from 'types';
import { isMessageId } from 'utils/messageId';

export const state = new WalletState();
export const embedHandler = new EmbedHandler(state);
export const tabHandler = new TabHandler(state);

export async function handleWalletRequest<TRequestName extends RequestName>(
  fromUrl: string,
  id: MessageId,
  request: WalletRequest<TRequestName>,
): Promise<WalletResponse<TRequestName>> {
  const { name } = request;

  if (isMessageId(id)) {
    if (name.startsWith('tab/')) {
      return tabHandler.handle(fromUrl, id, request);
    } else if (name.startsWith('embed/')) {
      return embedHandler.handle(fromUrl, id, request);
    }
  }

  throw new CoongError(ErrorCode.UnknownRequest);
}
