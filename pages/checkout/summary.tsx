import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"
import { CartList } from '../../components/cart/CartList';
import { OrderSummary } from "../../components/cart";
import { useContext, useEffect } from 'react';
import { CartContext } from '../../context/cart/CartContext';
import { countries } from '../../utils';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SummaryPage = () => {

    const router = useRouter();
    const { shippingAddress, numberOfItems, createOrder } = useContext(CartContext);


    useEffect(() => {
      if( !Cookies.get('firstName')) { //deberia chequear todos los datos
        router.push('/checkout/address');
      }
    
    }, [ router ]);

    const onCreateOrder = () => {
        createOrder();
    }
    


    if( !shippingAddress) {
        return <></>
    }



    const { firstName, lastName, address, address2, city, country, phone, zip } = shippingAddress;

    return (
        <ShopLayout title={"Carrito - 3"} pageDescription={"Resumen de la orden"}>
            <Typography variant="h1" component='h1'>Resumen de la orden</Typography>
            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems}  {numberOfItems === 1? 'producto' : 'productos' })</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent={'space-between'}>
                            <Typography variant='subtitle1'>Direccion de entrega</Typography>
                                <NextLink href='/checkout/address'>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>
                            
                            <Typography >{firstName} {lastName} </Typography>
                            <Typography >{ address} { address2? `, ${address2}`: ''} </Typography>
                            <Typography >{ city }, { zip }  </Typography>
                            <Typography >{ (countries.find(c => c.code === country))?.name } </Typography>
                            <Typography >{ phone }</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent={'end'}>
                                <NextLink href='/cart'>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />
                            <Box sx={{ mt: 3 }}>
                                <Button 
                                    color="secondary" 
                                    className='circular-btn' 
                                    fullWidth
                                    onClick={ onCreateOrder }
                                    >
                                    Confirmar Orden
                                </Button>
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage;
