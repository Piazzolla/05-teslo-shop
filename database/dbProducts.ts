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

    /* Idealmente todas la imagenes las tendria en un bucket, en claudinary en este caso
    en aws o google en un caso real mas probable   */
    product.images = product.images.map( image => {
        return image.includes('http') ? image: `${ process.env.HOST_NAME}products/${ image }`
    }) 

    return JSON.parse( JSON.stringify( product )); /* 
    esto de json parse y json stringify lo hace en general cuando la data viene con 
    un id o una fecha que conviene serializar
    */
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

export const getProductsByTerm = async( term: string ): Promise<IProduct[]> => {
    term = term.toString().toLowerCase();

    await db.connect();
    const products = await Product.find({
        $text: { $search: term }
    }).select('title images price inStock slug -_id').lean();
    //await db.disconnect();

    const updatedProducts = products.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image: `${ process.env.HOST_NAME}products/${ image }`
        });

        return product;
    })

    return updatedProducts;
}


export const getAllProducts = async(): Promise<IProduct[]> => {
    await db.connect();

    const allProducts = await Product.find({}).lean();


    const updatedProducts = allProducts.map( product => {
        product.images = product.images.map( image => {
            return image.includes('http') ? image: `${ process.env.HOST_NAME}products/${ image }`
        });

        return product;
    })
    //await db.disconnect();

    return JSON.parse(JSON.stringify(updatedProducts));
}