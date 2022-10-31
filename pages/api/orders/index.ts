import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { createRouteLoader } from 'next/dist/client/route-loader'
import { db } from '../../../database';
import { IOrder } from '../../../interfaces/order';
import Product from '../../../models/Product';

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch( req.method ) {
        case 'POST':
            return createOrder( req, res );
        default:
            return res.status(400).json({ message: 'Bad Request'})
    }


}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;

    // Verificar que tenemos un usuario
    const session: any = await getSession({ req });

    if( !session ) {
        return res.status(401).json({ message: 'Debe estar autenticado para hacer esto'});
    }

    // Crear un arreglo con los productos que la persona quiere
    const productsIds = orderItems.map( product => product._id );

    await db.connect();

    // los obtengo de la base de datos para cotejar los precios con lo que viene del front
    const dbProducts = await Product.find({ _id: {$in: productsIds }}).lean();

    try {
        const subTotal = orderItems.reduce( (prev, current) => {
            const currentPrice = dbProducts.find( prod => prod._id === current._id)?.price
            if( !currentPrice ) {
                throw new Error('Verifique el carrito de nuevo, producto no existe'); //no deberia pasar si no se manipula la orden desde el frontend
            }
            return (currentPrice * current.quantity) + prev
        }, 0)
    } catch (error) {
        
    }




    return res.status(201).json( req.body )
}
