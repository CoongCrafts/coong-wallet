import CryptoJS from 'crypto-js';

const ENCRYPTED_MNEMONIC = 'ENCRYPTED_MNEMONIC';

export default class Keyring {
  async init(mnemonic: string, password: string) {
    const encryptedSeed = CryptoJS.AES.encrypt(mnemonic, password).toString();
    localStorage.setItem(ENCRYPTED_MNEMONIC, encryptedSeed);
  }

  async isInitialized(): Promise<boolean> {
    return !!this.#getEncryptedMnemonic();
  }

  #getEncryptedMnemonic(): string | null {
    return localStorage.getItem(ENCRYPTED_MNEMONIC);
  }
}
