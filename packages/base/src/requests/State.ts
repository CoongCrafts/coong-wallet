import { assert } from '@coong/utils';
import { AccessStatus, RequestAppRequestAccess, ResponseAppRequestAccess } from 'types';

export type AppId = string;
export interface AppInfo {
  name: string;
  url: string;
  authorizedAccounts: string[];
}
export type AuthorizedApps = Record<AppId, AppInfo>;

const AUTHORIZED_ACCOUNTS_KEY = 'AUTHORIZED_ACCOUNTS';
const URL_PROTOCOLS = ['http://', 'https://'];

export default class State {
  #authorizedApps: AuthorizedApps = {};

  constructor() {
    this.#loadAuthorizedAccounts();

    window.addEventListener('storage', (event) => {
      if (event.key === AUTHORIZED_ACCOUNTS_KEY) {
        this.#loadAuthorizedAccounts();
      }
    });
  }

  #loadAuthorizedAccounts() {
    const authorizedAccountsString = localStorage.getItem(AUTHORIZED_ACCOUNTS_KEY) || '{}';
    this.#authorizedApps = JSON.parse(authorizedAccountsString) as AuthorizedApps;
  }

  #saveAuthorizedApps() {
    localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(this.#authorizedApps));
  }

  extractAppId(url: string) {
    assert(url && URL_PROTOCOLS.some((protocol) => url.startsWith(protocol)), `Invalid url: ${url}`);

    return url.split('//')[1];
  }

  ensureAppAuthorized(url: string): boolean {
    const appInfo = this.#authorizedApps[this.extractAppId(url)];

    assert(appInfo, `The app at ${url} has not been authorized yet, ${JSON.stringify(appInfo)}`);

    return true;
  }

  async authorizeApp(
    url: string,
    request: RequestAppRequestAccess,
    authorizedAccounts: string[],
  ): Promise<ResponseAppRequestAccess> {
    const appId = this.extractAppId(url);
    const existedApp = this.#authorizedApps[appId];

    if (existedApp) {
      return {
        result: AccessStatus.APPROVED,
        authorizedAccounts: existedApp.authorizedAccounts,
      };
    }

    // TODO assert(authorizedAccounts && authorizedAccounts.length, 'Choose at least one account to connect');

    this.#authorizedApps[appId] = {
      name: request.appName,
      url,
      authorizedAccounts,
    };

    this.#saveAuthorizedApps();

    return {
      result: AccessStatus.APPROVED,
      authorizedAccounts,
    };
  }
}
