import { GetServerSideProps } from 'next'
import type { NextPage } from 'next';
import { Box, Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';
import { IProduct } from '../../interfaces/products';
import { dbProducts } from '../../database';


interface Props {
    products: IProduct[];
    foundProducts: boolean;
    query: string;
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {

    return (
        <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuentra los mejores productos de Teslo Shop aqui'}>
            <Typography variant='h1' component='h1'>Buscar producto</Typography>
            {
                foundProducts ?
                    <Typography variant='h2' sx={{ mb: 1 }} textTransform='capitalize'>Término: {query}</Typography>
                    : (
                        <>                        
                        <Box display='flex'>
                            <Typography variant='h2' sx={{ mb: 1 }} >No encontramos ningun producto</Typography>
                            <Typography variant='h2' sx={{ ml: 1 }} textTransform='capitalize' color='secondary'>{query}</Typography>
                        </Box>
                            <Typography variant='h2' sx={{ mb: 1 }} >Pero mira que lindas cosas tenemos... </Typography>
                        </>

                    )

            }

            <ProductList products={products} />

        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { query = '' } = params as { query: string };

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: true
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query);

    // TODO: retornar otros productos cuando no hay resultados
    const foundProducts = products.length > 0;

    if (!foundProducts) {
        products = await dbProducts.getAllProducts();
    }


    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage
