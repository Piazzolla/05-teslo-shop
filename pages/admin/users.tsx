import { PeopleOutline } from "@mui/icons-material"
import { AdminLayout } from "../../components/layouts"
import { DataGrid } from '@mui/x-data-grid'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid/models';
import { Grid } from "@mui/material";
import useSWR from 'swr';
import { IUser } from '../../interfaces/user';



const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');


    if (!data && !error) return (<></>);

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250},
        { field: 'name', headerName: 'Nombre Completo', width: 300},
        { field: 'role', headerName: 'Rol', width: 300},
    ];

    const rows = data!.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }))

    return (
        <AdminLayout
            title={'Ususarios'}
            subTitle={'Mantenimiento de usuarios'}
            icon={<PeopleOutline />}
        >

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

        </AdminLayout>
    )
}

export default UsersPage