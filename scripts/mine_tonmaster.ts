import dotenv from  'dotenv';
dotenv.config();

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV5R1, TonClient, fromNano, SendMode, internal } from "@ton/ton";

//const mnemonic = process.env.YOUR_WALLET_MNEMONIC;
const TONCENTER_URL_ENDPOINT = "https://testnet.toncenter.com/api/v2/jsonRPC";

async function main() {
    
    const mnemonic = "shadow pupil run weird extend connect trend round thing toast edge short bounce guitar raw wage valid turkey town crouch depart tuna castle donate";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV5R1.create({ publicKey: key.publicKey, workchain: 0 });

    //const endpoint = await getHttpEndpoint({ network: "testnet"});
    const client = new TonClient({ 
        endpoint: TONCENTER_URL_ENDPOINT,
        apiKey: process.env.TONCENTER_API_KEY_TESTNET
     });

    if (!await client.isContractDeployed(wallet.address)) {
        return console.log(`wallet is not deployed`);
    }

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();

    const receivedWallet = `${process.env.YOUR_RECEIVED_WALLET_ADDRESS}`;

    await walletContract.sendTransfer({
        secretKey: key.secretKey,
        seqno: seqno,
        messages: [
            internal({
                to: receivedWallet,
                value: "0.05",
                body: "whatever",
                bounce: false,
            })
        ],
        sendMode: SendMode.NONE
    });

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("Waitting for confirm tx");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log(`tx confirmed`);
}

main();

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}