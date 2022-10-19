import NextLink from 'next/link';
import { Link } from '@mui/material';
import { Grid, Typography, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid'
import { GridColDef, GridRenderCellParams, GridValueGetterParams } from '@mui/x-data-grid/models';

import { ShopLayout } from '../../components/layouts/ShopLayout';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
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
                <NextLink passHref href={ `/orders/${ params.row.id }`}>
                    <Link underline='always'>
                        Ver orden
                    </Link>
                </NextLink>
            )
        }
    }
]

const rows = [
    { id: 1, paid: true, fullname: 'Fernando Herrera'},
    { id: 2, paid: false, fullname: 'Mariano Herrera'},
    { id: 3, paid: true, fullname: 'Melissa Herrera' },
    { id: 4, paid: true, fullname: 'Hernando Herrera'},
    { id: 5, paid: true, fullname: 'Eduardo Herrera' },
]


export const HistoryPage = () => {
    return (
        <ShopLayout title={'Historial'} pageDescription={'Hisotiral de ordenes del cliente'}>
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>
            <Grid container>
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

export default HistoryPage;
