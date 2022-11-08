import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database'
import { Product } from '../../../models'
import { IProduct } from '../../../interfaces/products';
import { isValidObjectId } from 'mongoose';

type Data = | { message: string }
            | IProduct[]
            | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method) {
        case 'GET':
            return getProduts(req, res)
        case 'PUT':
            return updateProduct( req, res )
        case 'POST':
            return createProduct( req, res)
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
const updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { _id = '', images = []} = req.body as IProduct;
    
    if( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El id del producto no es valido'});
    }
    
    if( images.length < 2) {
        return res.status(400).json({ message: 'Es necesario al menos 2 imagenes'});
        
    }
    // TODO: posiblemente tendremos un localhost:3000/products/asdasd.jpg
    
    try {
        await db.connect();
        const product = await Product.findById(_id);
        if(!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe el producto con ese id'});
        }
        
        //TODO: eliminar fotos en Cloudinary (o el image bucket que use)


        await product.update( req.body );
        
        await db.disconnect();
        
        return res.status(200).json( product )
    } catch (error) {
        
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor'});
    }

}

const  createProduct =  async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = []} = req.body as IProduct;
    if( images.length < 2 ) {
        return res.status(400).json({ message: 'El producto necesita al menos 2 imagenes'});
    }
    
    // TODO: posiblemente tendremos un localhost:300/products/asdas.jpg
    
    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug });
        if( productInDB ) {
            await db.disconnect();
            return res.status(400).json({ message: 'Ya existe un producto con ese slug'});
        }

        const product = new Product( req.body );
        await product.save();
        await db.disconnect();

        return res.status(201).json( product );

        
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor'});
    }
}

