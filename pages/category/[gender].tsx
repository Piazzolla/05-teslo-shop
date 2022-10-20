import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { ShopLayout } from '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';
import { IProduct } from '../../interfaces/products';

const TRADUCCION_GENDER = {
    men: 'Hombres',
    women: 'Mujeres',
    kids: 'Niños'
}


const MenPage: NextPage = () => {

  const router = useRouter()
  const { gender } = router.query;

  const { products  } = useProducts(`/products?gender=${gender}`) as { products: IProduct[]};
  const { isLoading } = useProducts(`/products?gender=${gender}`);

  return (
    <ShopLayout title={'Teslo-Shop'} pageDescription={'Encuentra los mejores productos de Teslo Shop para HOMBRES aqui'}>
      <Typography variant='h1' component='h1'>Tienda - { TRADUCCION_GENDER[`${gender}` as keyof typeof TRADUCCION_GENDER] } </Typography>
      <Typography variant='h2' sx={{ mb: 1 }} >Todos los productos</Typography>

  
      {
        isLoading ?
        <FullScreenLoading />
        : <ProductList products={ products }  />
      }

    </ShopLayout>
  )
}

export default MenPage
