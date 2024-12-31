import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV5R1, Address} from "@ton/ton";
import Lesson2 from "../wrappers/lesson2";
import { sleep, TONCENTER_URL_ENDPOINT } from "../lib/utils";

export async function run() {
    const client = new TonClient({
        endpoint: TONCENTER_URL_ENDPOINT,
        apiKey: process.env.TONCENTER_API_KEY_TESTNET
    });

    const mnemonic = `${process.env.YOUR_WALLET_MNEMONIC}`;
    const key = await mnemonicToWalletKey(mnemonic?.split(" "));
    const wallet = WalletContractV5R1.create({
        publicKey: key.publicKey,
        workchain: 0
    });
    if (!await client.isContractDeployed(wallet.address)) {
        return console.log(`wallet is not deployed`);
    }

    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    const seqno = await walletContract.getSeqno();

    const counterAddress = Address.parse("kQDOMAlfUSkj2UBTO03Exl3VjdDrFPH5JpnDQXKKy2Fn0LO7");
    const counter = new Lesson2(counterAddress);
    const counterContract = client.open(counter);

    await counterContract.sendIncrement(walletSender);

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("Waiting for tx to confirm");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log('tx has been confirm');
}