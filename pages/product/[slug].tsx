import { GetStaticPaths } from 'next'
import { GetStaticProps } from 'next'
import { GetServerSideProps } from 'next'
import { NextPage } from "next";
import { Grid, Box, Typography, Button, Chip } from "@mui/material";
import { ShopLayout } from "../../components/layouts";
import { SizeSelector } from "../../components/products";
import ProductSlideshow from "../../components/products/ProductSlideshow";
import { ItemCounter } from "../../components/ui";
import { initialData } from '../../database/products';
import { dbProducts } from '../../database';
import { IProduct, ICartProduct } from '../../interfaces';
import { useState } from 'react';
import { ISize } from '../../interfaces/products';



const product = initialData.products[0]; //temporal


interface Props {
  product: IProduct
}

export const ProductPage: NextPage<Props> = ({ product }) => {

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
        _id: product._id,
        image: product.images[0],
        price: product.price,
        size: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1,
  });


  const onSelectedSize = ( size: ISize ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }))
  }

  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideshow
            images={product.images}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display='flex' flexDirection='column'>
            {/* titulos */}
            <Typography variant='h1' component='h1'>{product.title}</Typography>
            <Typography variant='subtitle1' component='h2'>${product.price}</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter />
              <SizeSelector
                // selectedSize={product.sizes[0]}
                sizes={product.sizes} 
                selectedSize={ tempCartProduct.size }
                onSelectedSize={ onSelectedSize }
            />
            </Box>

            {/* Agregar al carrito */}
            {
              (product.inStock > 0) ?
                (
                  <Button color="secondary" className='circular-btn'>
                   {
                    tempCartProduct.size?
                     'Agregar al carrito' : 'Seleccione una talla'
                   }
                  </Button>
                )
                : (
                  <Chip
                    color="error"
                    variant="outlined"
                    label="No hay disponibles"
                  />
                )
            }

            {/* <Chip label='No hay disponibles' color="error" variant="outlined"/> */}
            {/* Descripcion */}
            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2'>Descripción</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

// getServerSideProps
// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


/* NO USAR ESTO, USAR STATIC PROPS PARA QUE HAGA TODO EL SERVIDOR  */
// export const getServerSideProps: GetServerSideProps = async (ctx) => {

//   const { slug = '' } = ctx.params as { slug: string };
//   const product =  await dbProducts.getProductBySlug(slug) as IProduct;

//   if( !product ) {
//     return {
//       redirect: {
//         destination: '/',
//         permanent: false
//       }
//     }
//   }

//   return {
//     props: 
//         { product }
//   }
// }


// GETstATICpAT
// You should use getStaticPaths if you’re statically pre-rendering pages that use dynamic routes

export const getStaticPaths: GetStaticPaths = async (ctx) => {


  const productSlugs = await dbProducts.getAllProductSlugs();

  return {
    paths: productSlugs.map(({ slug }) => ({
      params: { slug }
    })),
    fallback: "blocking"
  }
}

// You should use getStaticProps when:
//- The data required to render the page is available at build time ahead of a user’s request.
//- The data comes from a headless CMS.
//- The data can be publicly cached (not user-specific).
//- The page must be pre-rendered (for SEO) and be very fast — getStaticProps generates HTML and JSON files, both of which can be cached by a CDN for performance.

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug = '' } = params as { slug: string }
  const product = await dbProducts.getProductBySlug(slug);


  if (!product) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  return {
    props: {
      product
    },
    revalidate: 86400 // esta en segundos, 60 segs * 60 mins * 24 hs
  }
}

export default ProductPage;



