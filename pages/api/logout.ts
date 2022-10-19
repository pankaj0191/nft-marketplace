// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { removeCookies } from 'cookies-next'

import { SECRET } from 'utils'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    removeCookies(SECRET, { req, res });
    res.status(200).json({
        status: "success",
        message: "User logout"
    })
}
