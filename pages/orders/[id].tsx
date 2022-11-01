import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"
import { CartList } from '../../components/cart/CartList';
import { OrderSummary } from "../../components/cart";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';


interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    console.log({ order });

    return (
        <ShopLayout title={"Resumen de la Orden 123121"} pageDescription={"Resumen de la orden"}>
            <Typography variant="h1" component='h1'>Orden: ABC123</Typography>

            {/* <Chip
                sx={{ my: 2 }}
                label="Pendiente de pago"
                variant='outlined'
                color='error'
                icon={ <CreditCardOffOutlined /> }
            /> */}
            <Chip
                sx={{ my: 2 }}
                label="Orden ya fue pagada"
                variant='outlined'
                color='success'
                icon={<CreditScoreOutlined />}
            />
            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CartList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant='h2'>Resumen (3 productos)</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent={'space-between'}>
                                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                                <NextLink href='/checkout/address'>
                                    <Link underline='always'>
                                        Editar
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography >Fernando Herrera </Typography>
                            <Typography >323 Algun Lugar </Typography>
                            <Typography >Stittsville, HYA 23s </Typography>
                            <Typography >Canada </Typography>
                            <Typography >+1  32132132</Typography>
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
                                {/* TODO */}
                                <h1>Pagar</h1>
                                <Chip
                                    sx={{ my: 2 }}
                                    label="Orden ya fue pagada"
                                    variant='outlined'
                                    color='success'
                                    icon={<CreditScoreOutlined />}
                                />
                            </Box>

                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query;

    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?=/orders/${id}`,
                permanent: false
            }
        }
    }

    /* como ya estoy en backend no hago una request a la api rest, directamente le pego a la base de datos desde aca  */

    const order = await dbOrders.getOrderById(id.toString());

    if (!order) {
        return {

            redirect: {
                destination: `/auth/history`,
                permanent: false,
            }
        }
    }

    if (order.user !== session.user._id) {
        return {
            redirect: {
                destination: `/auth/history`,
                permanent: false,
            }
        }

    }


    return {
        props: {
            order
        }
    }
}

export default OrderPage;
