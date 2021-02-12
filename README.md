# Hedera Wallet Playground

Hedera wallet playground is a website with a collection of features that complement the Hedera Wallet browser extension and showcase the Hedera Token Service.

## Demo

Check it out at [Hedera Wallet Playground](https://hedera-wallet-playground.web.app/#/)

## Features

- Connects to the Hedera Wallet browser extension for execution of transactions
- Asset tokenizer - Helps users with tokenizing their own assets and provides guidance on which tokenization method to use - Allows for easier creation of NFT collections
- Ethereum to Hedera Hashgraph bridge - Connects to the Metamask wallet and allows users to wrap Ethereum for use on Hedera Hashgraph and unwrap wrapped Ethereum - A custodial protocol powered by Cloud Functions for Firebase
- Testnet account faucet - Allows users to easily obtain an account ID along with some testnet HBAR for testing purposes

## Deploy this project yourself

Prerequisites: install Nodejs, firebase-tools and initialize a Firebase project with the Blaze plan

1.  Run `npm install`
2.  Make a copy of `.env.template` and rename it to `.env`
3.  Fill in `ETHERSCAN_API_KEY`, `INFURA_PROJECT_ID`, `VUE_APP_BRIDGE_ETH_ADDRESS`, `VUE_APP_BRIDGE_HEDERA_ACCOUNT_ID`, `BRIDGE_HEDERA_PRIVATE_KEY` and `BRIDGE_ETH_PRIVATE_KEY` in the `.env` file
4.  Run `npm run init-token` and copy the logged Token ID into the `.env` file
5.  Run `firebase init` and select hosting and functions. Do not replace any files and change the hosting directory from `(public)` to `dist`
6.  Make a copy of the `.env` file in the `functions` directory
7.  Run `npm install` in the `functions` directory
8.  Run `firebase deploy --only functions`
9.  Copy the logged endpoint URL into the `.env` file (without the function name)
10. Run `npm run build`
11. Run `firebase deploy --only hosting` and visit the link logged in the console

If you face any issues it is likely due to improperly set up `.env` variables, run `npm run serve` to debug errors with your deployment.
