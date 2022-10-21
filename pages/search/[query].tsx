import type { NextPage } from 'next';
import { Typography } from '@mui/material';
import { ShopLayout } from  '../../components/layouts/ShopLayout';
import { ProductList } from '../../components/products';
import { useProducts } from '../../hooks';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';
import { IProduct } from '../../interfaces/products';


const SearchPage: NextPage = () => {

  const { products, isLoading } = useProducts('/products') as { products: IProduct[], isLoading: boolean};

  return (
    <ShopLayout title={'Teslo-Shop - Search'} pageDescription={'Encuentra los mejores productos de Teslo Shop aqui'}>
      <Typography variant='h1' component='h1'>Buscar producto</Typography>
      <Typography variant='h2' sx={{ mb: 1 }} >ABC --- 123</Typography>

      {
        isLoading ?
        <FullScreenLoading />
        : <ProductList products={ products }  />
      }

    </ShopLayout>
  )
}

export default SearchPage
