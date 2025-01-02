import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Lesson2 from "../wrappers/lesson2";

describe("Lesson 2 tests", () => {
    let blockchain: Blockchain;
    let wallet1: SandboxContract<TreasuryContract>;
    let counterContract: SandboxContract<Lesson2>;

    beforeEach(async () => {
        const counterCode = Cell.fromBoc(fs.readFileSync("contracts/lesson2.cell"))[0];
        const initialCounterValue = 17;
        const counter = Lesson2.createForDeploy(counterCode, initialCounterValue);

        // init sandbox
        blockchain = await Blockchain.create();
        wallet1 = await blockchain.treasury("user1");

        // deploy
        counterContract = blockchain.openContract(counter);
        await counterContract.sendDeploy(wallet1.getSender());
    }),

    it("should get counter value", async () => {
        const value = await counterContract.getCounter();
        expect(value).toEqual(17n);
    })
})