import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";

export class Genre extends Model {

    collection: string = "genries";

    constructor (req: NextApiRequest, res: NextApiResponse) {
        super("genries", req, res);
    }
}