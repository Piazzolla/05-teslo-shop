import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders: number; // isPaid true
    notPaidOrders: number;
    numberOfClients: number; // role: client
    numberOfProducts: number;
    productsWithNoInventory: number; // 0
    lowInventory: number; // productos con 10 o menos en stock
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    const respuesta = {} as Data;

    db.connect();

    const data = await Promise.all([
        (Order.count()),
        (Order.find({ isPaid: true }).count()),
        User.find({ role: 'client' }).count(),
        Product.count(),
        Product.find({ inStock: 0 }).count(),
        Product.find({ inStock: { $lte: 10 } }).count()
    ])

    respuesta.numberOfOrders = data[0];
    respuesta.paidOrders = data[1];
    respuesta.notPaidOrders = data[0] - data[1];
    respuesta.numberOfClients = data[2];
    respuesta.numberOfProducts = data[3];
    respuesta.productsWithNoInventory = data[4];
    respuesta.lowInventory = data[5];

    db.disconnect();
    res.status(200).json({
        ...respuesta
    })
}