import { db } from ".";
import { IProduct, ProductSlug } from "../interfaces";
import { Product } from "../models";

export const getProductBySlug = async( slug: string): Promise<IProduct | null> => {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();

   // await db.disconnect();

    if( !product ) {
        return null;
    }

    return JSON.parse( JSON.stringify( product ));
}



export const getAllProductSlugs = async(): Promise<ProductSlug[]> => {
    try {
        await db.connect();
        const slugs = await Product.find().select('slug -_id').lean();
       //await db.disconnect();
        return slugs;
        
    } catch (error) {
        console.log('error conectando a la base de datos')
        console.log(error);
        throw error;
    }

}