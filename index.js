"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const transactions_1 = require("@mysten/sui/transactions");
const client_1 = require("@mysten/sui/client");
const cetus_sui_clmm_sdk_1 = require("@cetusprotocol/cetus-sui-clmm-sdk");
const bn_js_1 = require("bn.js");
const src_1 = require("./src");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new client_1.SuiClient({ url: constants_1.RPC_ENDPOINT });
    const mainSui = new src_1.SuiKit({ secretKey: constants_1.PRIVATE_KEY, fullnodeUrls: [constants_1.RPC_ENDPOINT] });
    const balance = yield mainSui.getBalance('0x2::sui::SUI');
    console.log(`Volume bot is running`);
    console.log(`Wallet address: ${mainSui.getAddress()}`);
    console.log(`Pool ID: ${constants_1.POOL_ID}`);
    console.log(`Wallet SOL balance: ${(Number(balance.totalBalance) / 10 ** 9).toFixed(3)}SUI`);
    console.log(`Swap amount max: ${constants_1.SWAP_AMOUNT_MAX}SUI`);
    console.log(`Swap amount min: ${constants_1.SWAP_AMOUNT_MIN}SUI`);
    console.log(`Buying wait time max: ${constants_1.BUY_INTERVAL_MAX}s`);
    console.log(`Buying wait time min: ${constants_1.BUY_INTERVAL_MIN}s`);
    const volumeAction = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const destSui = new src_1.SuiKit({ fullnodeUrls: [constants_1.RPC_ENDPOINT] });
            // here saved the keypair into data.json file
            const mainBal = Number((yield mainSui.getBalance('0x2::sui::SUI')).totalBalance) / 10 ** 9;
            if (mainBal < constants_1.SWAP_AMOUNT_MAX) {
                console.log("Not enough SUI in main wallet to make volume action");
                return;
            }
            (0, utils_1.saveDataToFile)([{ privateKey: destSui.getKeypair().getSecretKey(), pubkey: destSui.getAddress() }]);
            const swapAmount = Math.round((Math.random() * (constants_1.SWAP_AMOUNT_MAX - constants_1.SWAP_AMOUNT_MIN) + constants_1.SWAP_AMOUNT_MIN) * 10 ** 9);
            const transferResp = yield mainSui.transferSui(destSui.getAddress(), swapAmount + 10 ** 7);
            yield client.waitForTransaction({ digest: transferResp.digest });
            yield (0, utils_1.sleep)(1000);
            const balance = yield destSui.getBalance('0x2::sui::SUI');
            const simulationAccount = destSui.getAddress();
            const sdk = (0, cetus_sui_clmm_sdk_1.initCetusSDK)({ network: constants_1.NETWORK, fullNodeUrl: constants_1.RPC_ENDPOINT, simulationAccount });
            sdk.senderAddress = simulationAccount;
            
            // buy part

            // kept as private
            
            // sell part

            // kept as private

            // check balance after sell and transfer back to main wallet
            const balanceAfter = yield destSui.getBalance('0x2::sui::SUI');
            let transferBackDigest = null;
            try {
                const tx = new transactions_1.Transaction();
                tx.transferObjects([tx.gas], mainSui.getAddress());
                if (tx) {
                    const txId = yield client.signAndExecuteTransaction({ transaction: tx, signer: destSui.getKeypair() });
                    const transaction = yield client.waitForTransaction({
                        digest: txId.digest,
                        options: {
                            showBalanceChanges: true,
                        },
                    });
                    transferBackDigest = txId.digest;
                    const walletsData = (0, utils_1.readJson)();
                    const wallets = walletsData.filter(({ pubkey }) => destSui.getAddress() != pubkey);
                    (0, utils_1.saveNewFile)(wallets);
                }
            }
            catch (error) {
                console.log("Error while transferring back to main wallet");
                return;
            }
            console.log("\n-----------------------------------New round ------------------------------------");
            console.log(`Transfer SUI signature : https://suiscan.xyz/mainnet/tx/${transferResp.digest}`);
            console.log(`Volume wallet address : https://suiscan.xyz/mainnet/account/${destSui.getAddress()}`);
            console.log(`Destination wallet balance : ${(Number(balance.totalBalance) / 10 ** 9).toFixed(3)}SUI`);
            if (buyDigest)
                console.log(`Buy swap signature : https://suiscan.xyz/mainnet/tx/${buyDigest}`);
            if (sellDigest)
                console.log(`Sell swap signature : https://suiscan.xyz/mainnet/tx/${sellDigest}`);
            if (transferBackDigest)
                console.log(`Transfer SUI back to main wallet signature : https://suiscan.xyz/mainnet/tx/${transferBackDigest}`);
            console.log("----------------------------------------------------------------------------------\n");
        }
        catch (error) {
            console.log("Error in one of the volume process");
        }
    });
    for (;;) {
        const buyInterval = Math.round((Math.random() * (constants_1.BUY_INTERVAL_MAX - constants_1.BUY_INTERVAL_MIN) + constants_1.BUY_INTERVAL_MIN) * 1000);
        volumeAction();
        yield (0, utils_1.sleep)(buyInterval);
    }
});
main();
