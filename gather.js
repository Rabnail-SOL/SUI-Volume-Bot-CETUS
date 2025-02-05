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
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const transactions_1 = require("@mysten/sui/transactions");
const client_1 = require("@mysten/sui/client");
const src_1 = require("./src");
const bn_js_1 = require("bn.js");
const client = new client_1.SuiClient({ url: constants_1.RPC_ENDPOINT });
const mainSui = new src_1.SuiKit({ secretKey: constants_1.PRIVATE_KEY, fullnodeUrls: [constants_1.RPC_ENDPOINT] });
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    let length = (0, utils_1.readJson)().length;
    console.log("Trying to gather");
    const walletsData = (0, utils_1.readJson)();
    length = walletsData.length;
    if (length == 0) {
        console.log("================== All gathered ==================");
        // break
        return;
    }
    const wallets = walletsData.map(({ privateKey }) => new src_1.SuiKit({ secretKey: privateKey, fullnodeUrls: [constants_1.RPC_ENDPOINT] }));
    wallets.map((suiWallet, i) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield (0, utils_1.sleep)(i * 1000);
            const balance = yield suiWallet.getBalance('0x2::sui::SUI');
            console.log("Balance:", balance.totalBalance);
            if (Number(balance.totalBalance) == 0) {
                const walletsData = (0, utils_1.readJson)();
                const wallets = walletsData.filter(({ pubkey }) => suiWallet.getAddress() != pubkey);
                (0, utils_1.saveNewFile)(wallets);
                console.log("Removed wallet.");
                return;
            }
            if (Number(balance.totalBalance) <= 3000000) {
                const transferAmount = Number(new bn_js_1.BN(3000000).sub(new bn_js_1.BN(balance.totalBalance)));
                const resp = yield mainSui.transferSui(suiWallet.getAddress(), transferAmount);
                yield client.waitForTransaction({
                    digest: resp.digest,
                    options: {
                        showBalanceChanges: true,
                    },
                });
                console.log("Transfer wallet, signature : ", resp.digest);
                yield (0, utils_1.sleep)(3000);
            }
            try {
                const tx = new transactions_1.Transaction();
                tx.transferObjects([tx.gas], mainSui.getAddress());
                if (tx) {
                    const txId = yield client.signAndExecuteTransaction({ transaction: tx, signer: suiWallet.getKeypair() });
                    yield client.waitForTransaction({
                        digest: txId.digest,
                        options: {
                            showBalanceChanges: true,
                        },
                    });
                    console.log("Transfer SUI back to main wallet, signature : ", txId.digest);
                }
            }
            catch (error) {
                console.log("Transaction error while transferring to main");
                return;
            }
            const balanceAfter = yield suiWallet.getBalance('0x2::sui::SUI');
            if (balanceAfter.totalBalance == "0") {
                const walletsData = (0, utils_1.readJson)();
                const wallets = walletsData.filter(({ pubkey }) => suiWallet.getAddress() != pubkey);
                (0, utils_1.saveNewFile)(wallets);
                console.log("Removed wallet.");
            }
        }
        catch (error) {
            console.log("Transaction error while gathering");
            return;
        }
    }));
});
main();
