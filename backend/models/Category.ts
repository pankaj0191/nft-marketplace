import type { NextApiRequest, NextApiResponse } from 'next'

import Model from "./Model";

export class Category extends Model {

    collection: string = "categories";

    constructor (req: NextApiRequest, res: NextApiResponse) {
        super("categories", req, res);
    }
}