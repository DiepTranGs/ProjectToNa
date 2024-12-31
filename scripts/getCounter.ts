import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import Lesson2 from "../wrappers/lesson2";
import { TONCENTER_URL_ENDPOINT } from "../lib/utils";

export async function run() {
    const client = new TonClient({
        endpoint: TONCENTER_URL_ENDPOINT,
        apiKey: process.env.TONCENTER_API_KEY_TESTNET
    });

    const counterAddress = Address.parse("kQDOMAlfUSkj2UBTO03Exl3VjdDrFPH5JpnDQXKKy2Fn0LO7");
    console.log(`counterAddress = ${counterAddress}`); //EQDOMAlfUSkj2UBTO03Exl3VjdDrFPH5JpnDQXKKy2Fn0Agx

    const counter = new Lesson2(counterAddress);
    const counterContract = client.open(counter);

    const counterValue = await counterContract.getCounter();
    console.log(`counterValue = ${counterValue.toString()}`); // 1735616159133
}