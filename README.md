NFT Marketplace

This project aims to provide a platform to buy and sell Non-fungible tokens(NFTs). 

Tools used:
1) Hardhat library: Ethereum development environment
2) React: Frontend framework
3) Pinata Cloud: used to store NFTs

Steps to run:
1) Clone the github repository using: git clone https://github.com/mdishh/blockchain.git
2) Install dependencies
   ```
   cd nft_marketplace
   npm install
   ```
3) Boot up local development blockchain
   ```
   npx hardhat node
   ```
4) Connect blockchain accounts to metamask
   1. Copy Private Keys:
   - Copy the private keys of the addresses and import them into Metamask.

   2. Connect Metamask to Hardhat Blockchain:
   - Connect your Metamask to the Hardhat blockchain using the network address 127.0.0.1:8545.

   3. Add Hardhat Network to Metamask:
   - If Hardhat is not already added to Metamask, follow these steps:
     - Open your browser and click the Metamask fox icon.
     - Click the dropdown button at the top center that lists all available networks.
     - Click "Add Network."
     - In the form that appears:
       - Enter "Hardhat" for the "Network Name."
       - Enter "http://127.0.0.1:8545" for the "New RPC URL."
       - Enter "31337" for the Chain ID.
     - Click "Save."
5) Migrate Smart Contracts
```
npx hardhat run src/backend/scripts/deploy.js --network localhost
```

6) Run Tests
```
npx hardhat test
```

7) Launch Frontend
```
npm run start
```
