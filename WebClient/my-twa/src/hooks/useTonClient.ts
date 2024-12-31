import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient } from "@ton/ton";
import { useAsyncInitilize } from "./useAsyncInitialize";

export function useTonClient() {
    return useAsyncInitilize(
        async () => 
            new TonClient({
                endpoint: await getHttpEndpoint({ network: 'testnet'}),
            })
    );
}