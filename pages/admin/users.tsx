import { PeopleOutline } from "@mui/icons-material"
import { DataGrid } from '@mui/x-data-grid'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid/models';
import { Grid, MenuItem, Select } from "@mui/material";
import useSWR from 'swr';
import { IUser } from '../../interfaces/user';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { NextPage } from "next";
import { tesloApi } from "../../api";



const UsersPage: NextPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');


    if (!data && !error) return (<></>);


    const onRoleUpdated = async(userId: string, newRole: string) => {

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole });
            
        } catch (error) {
            alert('No se pudo actualizar el rol del usuario')
        }
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250},
        { field: 'name', headerName: 'Nombre Completo', width: 300},
        { field: 'role', headerName: 'Rol', width: 300, renderCell: ({row}: GridRenderCellParams) => {
            return ( 
                <Select
                    value={ row.role }
                    label="Rol"
                    onChange={ ({ target }) => onRoleUpdated( row.id, target.value )}
                    sx={{ width: '300px'}}
                >
                    <MenuItem value='admin'>Admin</MenuItem>
                    <MenuItem value='client'>Client</MenuItem>
                    <MenuItem value='super-user'>Super User</MenuItem>
                    <MenuItem value='SEO'>SEO</MenuItem>

                </Select>
            )
        }},
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