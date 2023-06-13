<br/>
<p align="center">
  <img src="https://user-images.githubusercontent.com/6867026/223087394-fb37466f-3cb8-4cc8-ac83-e807514dc366.png" height="50">
</p>

<h1 align="center">
Coong Wallet
</h1>

<p align="center">
A website-based multi-chain crypto wallet for <a href="https://polkadot.network/">Polkadot</a> & <a href="https://kusama.network/">Kusama</a> ecosystem
<p>

<p align="center">
<a href="https://coongwallet.io">Coong Wallet Website</a> • <a href="https://app.coongwallet.io">Coong Wallet App</a> • <a href="https://dapp.coongwallet.io">Example Playground Dapp</a>
<p>

<p align="center">
  <img src="https://img.shields.io/github/license/CoongCrafts/coong-wallet?style=flat-square"/>
  <img src="https://img.shields.io/github/actions/workflow/status/CoongCrafts/coong-wallet/run-tests.yml?style=flat-square"/>
  <img src="https://img.shields.io/github/package-json/v/CoongCrafts/coong-wallet?filename=packages%2Fui%2Fpackage.json&style=flat-square"/>
</p>

<p align="center">
  <img width="479" src="https://user-images.githubusercontent.com/6867026/227230786-0796214a-3e3f-42af-94e9-d4122c730b62.png">
</p>

## What to expect from Coong Wallet?
- No need for extra steps to install browser extensions or mobile apps, Coong Wallet is just a website running on your browser
- Works on both desktop and mobile devices
- Compatible with [Polkadot.js extension](https://github.com/polkadot-js/extension) API, [integrate Coong Wallet](#integrate-coong-wallet-into-your-dapps) into your dapp within just a few steps
- One seed phrase to recover all created accounts (excluding imported accounts/private keys)
- Private keys and seed phrase are encrypted with a user chosen wallet password

## Set up development environment
1. Install NodeJS
2. Install dependencies: `yarn install`
3. Start the development server: `yarn start`
4. We can now access the local application at: `http://localhost:3030`
  
## Run it on Docker
1. Make sure you have [Docker](https://docs.docker.com/get-docker/) installed
2. Build an image of the wallet: `docker build -t coong-wallet .`
3. Run it: `docker run -dp 3030:3030 coong-wallet`
  
## Integrate Coong Wallet into your dapps
1. Install `@coong/sdk` to your dapp:
```bash
# via yarn
yarn add @coong/sdk
  
# via npm
npm install --save @coong/sdk
```  
2. Inject API & interact with Coong Wallet using the [Polakdot{.js} extension API](https://github.com/polkadot-js/extension#injection-information)
```typescript
import CoongSdk from '@coong/sdk';

const initializeCoongWallet = async () => {
  // Inject Coong Wallet API
  const sdk = new CoongSdk()
  await sdk.initialize();
  
  // We can now interact with the wallet using the similar Polkadot{.js} extension API
  const injected = await window['injectedWeb3']['coongwallet'].enable('Awesome Dapp');
  const connectedAccounts = await injected.accounts.get();
  
  return { sdk, injected, connectedAccounts }
}
  
await initializeCoongWallet();
```

3. Add/remove connected accounts
```ts
// Initilize wallet
const { injected } = await initializeCoongWallet();

// This will open a Coong Wallet window allowing users
// to add/remove accounts connecting to dapp
const updatedAccounts = await injected.accounts.update();
```

4. Sign out & clear up connected accounts
```ts
const signOut = () => {
  window['injectedWeb3']['coongwallet'].disable();
}

signOut();
```

Notes:
- By default, the SDK will connect to Coong Wallet at the offical URL `https://app.coongwallet.io`.
- You can also connect to a different URL of the wallet by customizing SDK options:
```typescript
  const sdk = new CoongSdk({ walletUrl: 'https://beta.coongwallet.io' });
  await sdk.initialize();  
```

## Injection Information
After running initialization (via `initialize()`), the SDK will inject `injectedWeb3` into the `window` global object exposing the following:

```ts
window.injectedWeb3 = {
  // this is the name of this wallet, there could be multiples injected,
  // each with their own keys, here `coongwallet` is for this wallet
  'coongwallet': {
    // semver of the wallet
    version: '0.1.0',

    // call this to enable the injection, and returns an injected
    // object containing the accounts, signer (or it will reject if not authorized)
    enable (originName: string): Promise<Injected>,
    
    // call this to sign out and clear up all connected accounts
    disable (): void
  }
}
```

## Injected API
The `Injected` API, as returned after calling `enable(originName)`, contains the following information:

```ts
interface Injected {
  // the interface for Accounts, as detailed below
  readonly accounts: Accounts;
  // the standard Signer interface for the API, as detailed below
  readonly signer: CoongSigner;
}

// exposes accounts
interface Accounts {
  // retrieves the list of connected accounts
  get: () => Promise<InjectedAccount[]>;
  // subscribe to all accounts, updating as they change
  subscribe: (cb: (accounts: Account[]) => any) => () => void
  // [NEW] asking for updating connected accounts
  update: () => Promise<InjectedAccount[]>
}

// a signer that communicates with the extension via sendMessage
interface CoongSigner extends SignerInterface {
  // signs an extrinsic payload from a serialized form
  signPayload?: (payload: SignerPayloadJSON) => Promise<SignerResult>;
  // signs a raw payload, only the bytes data as supplied
  signRaw?: (raw: SignerPayloadRaw) => Promise<SignerResult>;
}

interface InjectedAccount {
  // ss-58 encoded address
  readonly address: string;
  // the genesisHash for this account (empty if applicable to all)
  readonly genesisHash?: string;
  // (optional) name for display
  readonly name?: string;
  // Keypair type: 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum'
  readonly type?: string;
};
```

## Prevent Blocking Popups

Coong SDK uses `window.open` to fire up Coong Wallet windows/popups allowing users to interact with the wallet (e.g: Request to access wallet accounts, request to sign a transaction...), browsers might block this open popup API depending on various reasons. Below is a few practices to help prevent this blocking popups issue from happening.

1. Only call APIs from a user interaction (clicks/touches)
2. For actions that might take time (asynchronously) to complete (transfer balance ...), launch a waiting wallet instance (`CoongSdk.newWaitingWalletInstance()`) first thing on user interaction.  


## How to run tests
1. [Set up the development environment](#set-up-development-environment).
2. Simply run `yarn test` to trigger testing for all packages
   
## License

[Apache 2.0](https://github.com/CoongCrafts/coong-wallet/blob/main/LICENSE)
  
  
  
