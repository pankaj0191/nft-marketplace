
# NFT Marketplace

## Getting started

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

## Clone this project on local ( https/ssh )

### Node Version
 v16.13.2

```shell
nvm use
```

## Install node dependencies
For npm
```shell
npm install
```

### Create .env file then copy the content of .env.example file

### Compile your solidity code
```shell
npx hardhat compile
```

### Create master entries of the project
```shell
node backend/seeder
```

### Run project
For npm
```shell
npm run dev
```

### Build project
For npm
```shell
npm run build
```

### Check production code of the project
For npm
```shell
npm run start
```

# Deployed your tested/complied code on the configured server
```shell
node scripts/deploy.js --network {network_name}
```

# Copy and paste both address after deploy to config.js file ( on root folder )
