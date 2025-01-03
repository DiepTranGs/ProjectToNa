import { beginCell, BitBuilder, BitReader, Cell } from '@ton/ton';

export function unixNow() {
    return Math.floor(Date.now() / 1000);
}

const OFFCHAIN_CONTENT_PREFIX = 0x01;

export function encodeOffChainContent(content: string) {
    let data = Buffer.from(content);
    let offChainPrefix = Buffer.from([OFFCHAIN_CONTENT_PREFIX]);
    data = Buffer.concat([offChainPrefix, data]);
    return makeSnakeCell(data);
}

export function decodeOffChainContent(content: Cell) {
    let data = flattenSnakeCell(content);

    let prefix = data[0];
    if (prefix !== OFFCHAIN_CONTENT_PREFIX) {
        throw new Error(`Unknown content prefix: ${prefix.toString(16)}`);
    }
    return data.subarray(1).toString();
}

export function makeSnakeCell(data: Buffer): Cell {
    const chunks = bufferToChunks(data, 127);

    if (chunks.length === 0) {
        return beginCell().endCell();
    }

    if (chunks.length === 1) {
        return beginCell().storeBuffer(chunks[0]).endCell();
    }

    let curCell = beginCell();

    for (let i = chunks.length - 1; i >= 0; i--) {
        const chunk = chunks[i];

        curCell.storeBuffer(chunk);

        if (i - 1 >= 0) {
            const nextCell = beginCell();
            nextCell.storeRef(curCell);
            curCell = nextCell;
        }
    }

    return curCell.endCell();
}

export function flattenSnakeCell(cell: Cell): Buffer {
    let c: Cell | null = cell;

    const bitResult = new BitBuilder();
    while (c) {
        const cs = c.beginParse();
        if (cs.remainingBits === 0) {
            break;
        }

        const data = cs.loadBits(cs.remainingBits);
        bitResult.writeBits(data);
        c = c.refs && c.refs[0];
    }

    const endBits = bitResult.build();
    const reader = new BitReader(endBits);

    return reader.loadBuffer(reader.remaining / 8);
}

function bufferToChunks(buff: Buffer, chunkSize: number) {
    let chunks: Buffer[] = [];
    while (buff.byteLength > 0) {
        chunks.push(buff.subarray(0, chunkSize));
        buff = buff.subarray(chunkSize);
    }

    return chunks;
}

export const TONCENTER_URL_ENDPOINT = "https://testnet.toncenter.com/api/v2/jsonRPC"; 

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}