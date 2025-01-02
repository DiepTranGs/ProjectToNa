import * as fs from "fs";
import { Cell } from "@ton/core";
import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox";
import Lesson2 from "../wrappers/lesson2";
import { toNano } from '@ton/ton';

describe("Lesson 2 tests", () => {
    let blockchain: Blockchain;
    let wallet1: SandboxContract<TreasuryContract>;
    let counterContract: SandboxContract<Lesson2>;

    beforeEach(async () => {
        const counterCode = Cell.fromBoc(fs.readFileSync("build/counter.debug.cell"))[0];
        const initialCounterValue = 17;
        const counter = Lesson2.createForDeploy(counterCode, initialCounterValue);

        // init sandbox
        blockchain = await Blockchain.create();
        wallet1 = await blockchain.treasury("user1");

        // deploy
        counterContract = blockchain.openContract(counter);
        await counterContract.sendDeploy(wallet1.getSender());
    }),

    it("should send ton coin to the contract", async () => {
        console.log("sending 7.123 TON");
        await wallet1.send({
          to: counterContract.address,
          value: toNano("7.123")
        });
      });
    
      it("should increment the counter value", async () =>  {
        console.log("sending increment message");
        await counterContract.sendIncrement(wallet1.getSender());
      })
})