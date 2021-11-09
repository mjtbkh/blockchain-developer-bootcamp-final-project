##  blockchain-developer-bootcamp-final-project

my public ethereum account:
> 0x07889DEFeB525F614A0293ca49036f7950F6dbac

# Smart-contract based premium podcast membership
A podcast membership dApp deployable on EVM-compatible blockchains, in which subscribers must pay pledge for each episode they want to have access to.

Project will be using smart-contracts as back-end service and will have a UI developed using ethers.js, Next.js, tailwindcss.

directory structure
```
📦project
|	🧾LICENSE
|	🧾README.md
|	🧾package.json
|	🧾truffle-config.js
|
|-	📁client
|	|-	📁components
|	|-	📁contexts
|	|-	📁hooks
|	|-	📁pages
|	|-	📁public
|	|-	📁styles
|
|
|-	📁contracts
|	|	🧾EthRadio.sol
|	|	🧾Migration.sol
|
|
|-	📁migrations
|	|	🧾1_initial_migration.js
|	|	🧾2_deploy_contracts.js
|	|	🧾3_upgrade_ethradio_contract.js.template
|
|
|-	📁test
	|	🧾eth_radio.test.js
	|	🧾helper.js
```

## Dependencies and deployment
To install dependencies:
```bash
npm install
```

To spin-up a `truffle` development environment and deploy contract for development purposes. Configured network in `truffle-config.js` is named `develop` and runs on port `8545`:
```bash
#	truffle dev env running on http://127.0.0.1/8545
#	network_id: 5777
npm run dev
```

To compile the contract and get a ready-to-deploy output:
```bash
npm run build
```

To run truffle tests located under `/test`:
```bash
npm run test
```
## Front-end
- Front-end is implemented using Next.js and connects to MetaMask using ethers.js
- Front-end is under [https://github.com/mjtbkh/blockchain-developer-bootcamp-final-project/client](/client) directory

In order to spin-up front-end app in development env:
```bash
cd client

# install frontend dependencies
yarn install

# spin-up development version
yarn dev
```
In order to build front-end app (production-ready):
```bash
cd client
yarn build
```


## Details
- Subscribers will get access to newly published episodes while they have enough balance delegated to the smart-contract.
- Contract owner is able to publish new episodes, withdraw funds from contract, destroy contract and give refunds to subscribers (remaining balance not used to get access to episoded).

