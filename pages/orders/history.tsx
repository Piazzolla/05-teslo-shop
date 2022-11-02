import { GetServerSideProps, NextPage } from 'next'
import NextLink from 'next/link';
import { Link } from '@mui/material';
import { Grid, Typography, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid/models';

import { ShopLayout } from '../../components/layouts/ShopLayout';
import { getSession } from 'next-auth/react';
import { dbOrders } from '../../database';
import { IOrder } from '../../interfaces';
import { IUser } from '../../interfaces/user';
import { useContext } from 'react';
import { AuthContext } from '../../context/auth/AuthContext';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullName', headerName: 'Nombre Completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra informacion si esta pagada la orden o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
            return (

                params.row.paid ?
                    <Chip color="success" label="Pagada" variant='outlined' /> :
                    <Chip color="error" label="No Pagada" variant='outlined' />
            )
        }
    },
    {
        field: 'linkName', headerName: 'Ver orden', width: 100, sortable: false,
        renderCell: (params: GridRenderCellParams) => {
            return (
                <NextLink passHref href={`/orders/${params.row.orderId}`}>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    }
]


interface Props {
    orders: IOrder[];
}


export const HistoryPage: NextPage<Props> = ({ orders }) => {

    //const rows = ...
    //{ id: indice + 1, paid: true, fullname: 'Fernando Herrera', orderId: 1324810273481724 },

    const rows = orders.map((order, index) => {
        return {
            id: index + 1,
            paid: order.isPaid,
            fullName: `${ order.shippingAddress.firstName } ${ order.shippingAddress.lastName }`,
            orderId: order._id
        }
    });

    console.log({rows});

    return (
        <ShopLayout title={'Historial'} pageDescription={'Hisotiral de ordenes del cliente'}>
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>
            <Grid container className='fadeIn'>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        columns={columns}
                        rows={rows}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                    />

                </Grid>
            </Grid>
        </ShopLayout>
    )
}


// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session: any = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/auth/login?p=/orders/history',
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getOrdersByUser(session.user._id);

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage;
