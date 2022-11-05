import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces/products';

type Data = | { message: string }
            | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method) {
        case 'GET':
            return getProduts(req, res)
        case 'PUT':
        case 'POST':
        default:
            res.status(400).json({ message: 'Bad request' })
    }


}

const getProduts =  async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    await db.connect();
    const products = await Product.find()
            .sort( {title: 'asc'})
            .lean();
    await db.disconnect();


    // TODO:
    // Tendremos que actualizar las imagenes

    res.status(200).json( products );
}
