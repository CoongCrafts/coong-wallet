import State from 'requests/State';
import { EmbedHandler } from 'requests/EmbedHandler';
import TabHandler from '@coong/base/requests/TabHandler';
import { MessageId, RequestName, WalletRequest, WalletResponse } from '@coong/base/types';
import { CoongError, ErrorCode } from '@coong/util';

export const state = new State();
export const embedHandler = new EmbedHandler(state);
export const tabHandler = new TabHandler(state);

export async function handleWalletRequest<TRequestName extends RequestName>(
  fromUrl: string,
  id: MessageId,
  request: WalletRequest<TRequestName>,
): Promise<WalletResponse<TRequestName>> {
  if (id.startsWith('tab/')) {
    return tabHandler.handle(fromUrl, id, request);
  } else if (id.startsWith('embed/')) {
    return embedHandler.handle(fromUrl, id, request);
  }

  throw new CoongError(ErrorCode.UnknownRequest);
}
