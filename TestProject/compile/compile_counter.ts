import { compileFunc, compilerVersion } from "@ton-community/func-js";
import { Cell } from '@ton/ton';

async function main() {
    let version = await compilerVersion();

    let result = await compileFunc({
        targets: ['counter.debug.fc'],
        sources: {
            "stdlib.fc": "<stdlibCode>",
            "counter.debug.fc": "<contractCode>"
        }
    });

    if (result.status === 'error') {
        console.error(result.message);
        return;
    }

    let codeCell = Cell.fromBoc(Buffer.from(result.codeBoc, "base64"))[0];

    console.log(result.fiftCode);
}

main();