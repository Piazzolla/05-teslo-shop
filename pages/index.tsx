import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '../components/layouts/ShopLayout';
import { ProductList } from '../components/products';
import { useProducts } from '../hooks';
import { FullScreenLoading } from '../components/ui/FullScreenLoading';
import { IProduct } from '../interfaces/products';


const HomePage: NextPage = () => {
  

  const { products, isLoading } = useProducts('/products') as { products: IProduct[], isLoading: boolean};

  return (
    <ShopLayout title={'Teslo-Shop'} pageDescription={'Encuentra los mejores productos de Teslo Shop aqui'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1 }} >Todos los productos</Typography>

      {
        isLoading ?
        <FullScreenLoading />
        : <ProductList products={ products }  />
      }

    </ShopLayout>
  )
}

export default HomePage
