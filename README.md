<br/>
<p align="center">
  <img src="https://user-images.githubusercontent.com/6867026/223087394-fb37466f-3cb8-4cc8-ac83-e807514dc366.png" height="50">
</p>

<h1 align="center">
Coong Wallet
</h1>

<p align="center">
A website-based multichain crypto wallet for <a href="https://polkadot.network/">Polkadot</a> & <a href="https://kusama.network/">Kusama</a> ecosystem
<p>

<p align="center">
  <img src="https://img.shields.io/github/license/CoongCrafts/coong-wallet?style=flat-square"/>
  <img src="https://img.shields.io/github/actions/workflow/status/CoongCrafts/coong-wallet/run-tests.yml?style=flat-square"/>
  <img src="https://img.shields.io/github/package-json/v/CoongCrafts/coong-wallet?filename=packages%2Fui%2Fpackage.json&style=flat-square"/>
</p>


## What to expect from Coong Wallet?
- No need for extra steps to install browser extensions or mobile apps, Coong Wallet is just a website running on your browser
- Works on both desktop and mobile
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
2. Inject Coong API & interact with Coong Wallet using the [Polakdot{.js} extension API](https://github.com/polkadot-js/extension#injection-information)
```typescript
import CoongSdk from '@coong/sdk';
 
  
const initCoongWallet = async () => {
  // Inject Coong Wallet API
  await CoongSdk.instance().initialize();
  
  // We can now interact with the wallet using the similar Polkadot{.js} extension API
  const coongInjected = await window['injectedWeb3']['coongwallet'].enable('Awesome Dapp');
  const approvedAccounts = await coongInjected.accounts.get();
}
  
initCoongWallet();
```

Notes:
- By default, the SDK will connect to Coong Wallet at the offical URL `https://app.coongwallet.io`.
- You can also connect to a different URL of the wallet by passing the URL to the `initialize` method.
```typescript
  await CoongSdk.instance().initialize('https://beta.coongwallet.io')  
```

## How to run tests
1. [Set up the development environment](#set-up-development-environment).
2. Simply run `yarn test` to trigger testing for all packages
  
## Known issues
1. Coong Wallet relies on the cross-tab/cross-origin communication mechanism via `window.postMessage` API to send messages from Dapp to Wallet (an iframe) to retrieve information in the wallet. So Coong will **not work properly** if you enable the setting `Block third-party cookies` on your browser. Though Coong does not use any cookies, but this will also disable/block access to website data (`localStorage`, `IndexedDB`, ...) of Coong instance loaded inside the iframe. **So for now, make sure to enable `Third-party cookies` setting on your browser to enjoy Coong Wallet.** Note: You should be good to go if you're using Google Chrome, since Chrome has the `Block third-party cookies` setting disabled by default.

2. Coong Wallet uses the `window.open` API to open a wallet instance when dapps need to ask for permissions from users (e.g: Request to access wallet accounts, request to sign a transaction...), some browsers (Firebox, Safari, ...) will block this open popup API depending on various reasons, so you (users) need to allow dapp (browsers) to open popup of Coong Wallet when making these interactions (The browsers will ask for your consent to open Coong Wallet popup). Note: If you're using Chromium browsers (Chrome, Brave, Edge), you might not get into this issue.
  
## License

[Apache 2.0](https://github.com/CoongCrafts/coong-wallet/blob/main/LICENSE)
  
  
  
