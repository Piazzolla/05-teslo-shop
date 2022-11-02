import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { PayPalButtons } from "@paypal/react-paypal-js";

import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"
import { CartList } from '../../components/cart/CartList';
import { OrderSummary } from "../../components/cart";
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { countries } from '../../utils';


interface Props {
    order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

    const { shippingAddress } = order;

    return (
        <ShopLayout title={"Resumen de la Orden 123121"} pageDescription={"Resumen de la orden"}>
            <Typography variant="h1" component='h1'>Orden: {order._id}</Typography>

            {
                order.isPaid ?
                    (
                        <Chip
                            sx={{ my: 2 }}
                            label="Orden ya fue pagada"
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                        />
                    ) :
                    (

                        < Chip
                            sx={{ my: 2 }}
                            label="Pendiente de pago"
                            variant='outlined'
                            color='error'
                            icon={<CreditCardOffOutlined />}
                        />
                    )
            }


            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <CartList products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary-card">
                        <CardContent>
                            <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent={'space-between'}>
                                <Typography variant='subtitle1'>Direccion de entrega</Typography>
                            </Box>

                            <Typography >{shippingAddress.firstName} {shippingAddress.lastName} </Typography>
                            <Typography >{shippingAddress.address} {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ''}</Typography>
                            <Typography >{shippingAddress.city} {shippingAddress.zip}</Typography>
                            <Typography >{countries.find((c => c.code === shippingAddress.country))?.name} </Typography>
                            <Typography >{shippingAddress.phone}</Typography>
                            <Divider sx={{ my: 1 }} />

                            <OrderSummary order={{
                                tax: order.tax,
                                subTotal: order.subTotal,
                                numberOfItems: order.numberOfItems,
                                total: order.total
                            }} />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                {/* TODO */}
                                {
                                    order.isPaid ?
                                        (
                                            <Chip
                                                sx={{ my: 2 }}
                                                label="Orden ya fue pagada"
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        ) : (
                                            <PayPalButtons
                                                createOrder={(data, actions) => {
                                                    return actions.order.create({
                                                        purchase_units: [
                                                            {
                                                                amount: {
                                                                    value: "510.12",
                                                                },
                                                            },
                                                        ],
                                                    });
                                                }}
                                                onApprove={(data, actions) => {
                                                    return actions.order!.capture().then((details) => {
                                                        const name = details.payer.name.given_name;
                                                        alert(`Transaction completed by ${name}`);
                                                    });
                                                }}
                                            />
                                        )
                                }
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
