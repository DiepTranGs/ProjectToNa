import { Address, TonClient } from '@ton/ton';
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { unixNow } from '../lib/utils';
import { MineMessageParams, Queries } from '../wrappers/NftGiver';
import { toNano } from '@ton/ton';
import { NetworkProvider } from '@ton/blueprint';

import dotenv from  'dotenv';
dotenv.config();

const URL_ENDPOINT = "https://testnet.toncenter.com/api/v2/jsonRPC";

const walletAddress = Address.parse(`${process.env.YOUR_WALLET_ADDRESS}`);
const collectionAddress = Address.parse(`${process.env.COLLECTION_ADDRESS}`);

async function mine() {

    const endpoint = URL_ENDPOINT;

    // const endpoint = await getHttpEndpoint({
    //     network: "testnet",
    // });

    const client = new TonClient({ endpoint });

    const miningData = await client.runMethod(collectionAddress, "get_mining_data");
    // console.log(miningData.stack);

    const { stack } = miningData;

    const complexity = stack.readBigNumber();
    const lastSuccess = stack.readBigNumber();
    const seed = stack.readBigNumber();
    const targetDelta = stack.readBigNumber();
    const minCpl = stack.readBigNumber();
    const maxCpl = stack.readBigNumber();

    // console.log({ complexity, lastSuccess, seed, targetDelta, minCpl, maxCpl });

    const mineParams: MineMessageParams = {
        expire: unixNow() + 300, // 5 min max to make tx
        mintTo: walletAddress,
        data1: 0n, //nonce
        seed // unique seed from get_mining_data
    };

    let msg = Queries.mine(mineParams); // create a transaction message
    let progress = 0;

    const bufferToBigint = (buffer: Buffer) => BigInt('0x' + buffer.toString('hex'));

    while (bufferToBigint(msg.hash()) > complexity) {
        console.clear();
        console.log(`Mining started: please wait for 30-60 secs`);
        console.log();
        console.log(`Mined ${progress} hases! Last: `, bufferToBigint(msg.hash()))
        mineParams.expire = unixNow() + 300;
        mineParams.data1 += 1n;
        msg = Queries.mine(mineParams);
        progress++;
    }

    console.log()
    console.log('💎 Mission completed: msg_hash less than pow_complexity found!');
    console.log()
    console.log('msg_hash:       ', bufferToBigint(msg.hash()))
    console.log('pow_complexity: ', complexity)
    console.log('msg_hash < pow_complexity: ', bufferToBigint(msg.hash()) < complexity);

    return msg;
}

export async function run(provider: NetworkProvider) {
    const msg = await mine();

    await provider.sender().send({
        to: collectionAddress,
        value: toNano(0.05),
        body: msg
    });
}

// mine();