import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from "@ton/core";

export default class Lesson2 implements Contract {

    static createForDeploy(code: Cell, initialCounterValue: number): Lesson2 {
        const data = beginCell()
                .storeUint(initialCounterValue, 64)
                .endCell();

        const workchain = 0;
        const address = contractAddress(workchain, { code, data });
        return new Lesson2(address, { code, data });
    }

    constructor(readonly address: Address, readonly init?: { code: Cell, data: Cell }) {}

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.01",
            bounce: false
        });
    }
}