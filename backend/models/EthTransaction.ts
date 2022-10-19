import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";

export class EthTransaction extends Model {

    collection: string = "eth_transactions";

    constructor (req: NextApiRequest, res: NextApiResponse) {
        super("eth_transactions", req, res);
    }
}