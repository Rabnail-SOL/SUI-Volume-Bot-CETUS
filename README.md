
# SUI Volume Bot (CETUS-DEX)

SUI volume bot that makes endless buy and sell swap transactions for volume and maker increasement purpose automatically in CETUS dex platform. All transactions and gas fees are optimized as a minimum.

### Original project is written with typescript, the code here is compiled demo version, if you want full version, you can contact me in telegram or twitter. 

## 🌟 Features
- ⚙️ **Automated SUI Distribution**: Distributes SUI to new wallets.
- 🔄 **Endless Buy and Sell Swaps**: Performs simultaneous buy and sell transactions.
- 🛠️ **Configurable Parameters**: Allows customization of buy amounts, intervals, distribution settings, and more.

## 📋 Environment Variables

The bot uses the following environment variables. Rename the `.env.copy` file to `.env` and set the necessary variables.

```env
PRIVATE_KEY=

NETWORK=mainnet

RPC_ENDPOINT=https://rpc.ankr.com/sui/<RPC_API_KEY>
RPC_WEBSOCKET_ENDPOINT=wss://rpc.ankr.com/sui/ws/<RPC_API_KEY>

DISTRIBUTE_INTERVAL_MAX=30  # seconds
DISTRIBUTE_INTERVAL_MIN=20  # seconds

BUY_INTERVAL_MAX=10    # seconds
BUY_INTERVAL_MIN=5     # seconds

SWAP_AMOUNT_MAX=0.5   # SUI 
SWAP_AMOUNT_MIN=0.1   # SUI 

POOL_ID=0x1de5cc16141c21923bfca33db9bb6c604de5760e4498e75ecdfcf80d62fb5818
```

#  🚀 Usage
### 1. Clone the repository
```
git clone https://github.com/Rabnail-SOL/SUI-Volume-Bot-CETUS.git
cd SUI-Volume-Bot-CETUS
```
### 2. Install dependencies
```
npm install
```
### 3. Configure the environment variables

Rename the .env.copy file to .env and set RPC and WSS, main keypair's secret key and other variables.

### 4. Run the bot

```
npm start
```


### 5. Gather the funds from distributed wallets

```
npm run gather
```


# 👤 Author

### Discord: rabnail in discord

### Twitter: [@Rabnail_SOL](https://twitter.com/Rabnail_SOL)   

### Telegram: [@Rabnail_SOL](https://t.me/Rabnail_SOL)   


You can always find me here, for help, or for other projects.
