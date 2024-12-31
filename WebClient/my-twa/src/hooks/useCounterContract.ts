import { useEffect, useState } from 'react';
import Lesson2 from '../contracts/lesson2';
import { useTonClient } from './useTonClient';
import { useAsyncInitilize } from './useAsyncInitialize';
import { useTonConnect } from './useTonConnect';
import { Address, OpenedContract } from '@ton/core';

export function useCounterContract() {
    const client = useTonClient();
    const [val, setVal] = useState<null | string>();
    const { sender } = useTonConnect();

    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

    const counterContract = useAsyncInitilize(async () => {
        if (!client) return;
        const contract = new Lesson2(
            Address.parse("kQDOMAlfUSkj2UBTO03Exl3VjdDrFPH5JpnDQXKKy2Fn0LO7")
        );
        return client.open(contract) as OpenedContract<Lesson2>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!counterContract) return;
            setVal(null);
            const val = await counterContract.getCounter();
            setVal(val.toString());
            await sleep(5000);
            getValue();
        }

        getValue();
    }, [counterContract]);

    return {
        value: val,
        address: counterContract?.address.toString(),
        sendIncrement: () => {
            return counterContract?.sendIncrement(sender);
        }
    };
}