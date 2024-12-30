import dotenv from  'dotenv';
dotenv.config();

import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { WalletContractV5R1, TonClient, fromNano, SendMode } from "@ton/ton";

//const mnemonic = process.env.YOUR_WALLET_MNEMONIC;
const TONCENTER_URL_ENDPOINT = "https://testnet.toncenter.com/api/v2/jsonRPC";

async function main() {
    
    const mnemonic = "shadow pupil run weird extend connect trend round thing toast edge short bounce guitar raw wage valid turkey town crouch depart tuna castle donate";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV5R1.create({ publicKey: key.publicKey, workchain: 0 });

    const endpoint = await getHttpEndpoint({ network: "testnet"});
    const client = new TonClient({ endpoint });

    const balance = await client.getBalance(wallet.address);
    console.log(`balance of ${wallet.address} = ${fromNano(balance)}`);

    const walletContract = client.open(wallet);
    const seqno = await walletContract.getSeqno();
    console.log(`squeno: ${seqno}`);
}

main();