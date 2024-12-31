import * as fs from "fs";
import { getHttpEndpoint  } from "@orbs-network/ton-access";
import { mnemonicToWalletKey  } from "@ton/crypto";
import { TonClient, Cell, WalletContractV5R1 } from "@ton/ton";
import Lesson2 from "../wrappers/lesson2";
import { TONCENTER_URL_ENDPOINT, sleep } from "../lib/utils.ts";

import dotenv from "dotenv";
dotenv.config();


export async function run() {
    const client = new TonClient({
        endpoint: TONCENTER_URL_ENDPOINT,
        apiKey: process.env.TONCENTER_API_KEY_TESTNET
    });

    const counterCode = Cell.fromBoc(fs.readFileSync("build/lesson2.cell"))[0];
    const initialCounterValue = Date.now();
    const counter = Lesson2.createForDeploy(counterCode, initialCounterValue);

    console.log(`contract address: ${counter.address.toString()}`);
    if (await client.isContractDeployed(counter.address)) {
        return console.log(`Counter contract already deployed`);
    }

    const mnemonic = "shadow pupil run weird extend connect trend round thing toast edge short bounce guitar raw wage valid turkey town crouch depart tuna castle donate";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
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

    const counterContract = client.open(counter);
    await counterContract.sendDeploy(walletSender);

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log(`waiiting for deploy tx to confirm...`);
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("deployed");
}

