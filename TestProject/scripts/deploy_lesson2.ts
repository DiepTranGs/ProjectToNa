import * as fs from "fs";
import { TonClient, Cell, WalletContractV5R1 } from "@ton/ton";
import Lesson2 from "../wrappers/lesson2";

import dotenv from "dotenv";
dotenv.config();

export async function run() {

    const counterCode = Cell.fromBoc(fs.readFileSync("../contracts/lesson2.cell"))[0];
    const initialCounterValue = 17;
    const counter = Lesson2.createForDeploy(counterCode, initialCounterValue);


}