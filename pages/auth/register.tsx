import NextLink from 'next/link';
import { Box, Grid, Typography, TextField, Button, Link } from '@mui/material';
import { AuthLayout } from "../../components/layouts"

export const RegisterPage = () => {
  return (
    <AuthLayout title={'Ingresar'}>
        <Box sx={{ width: 350, padding: '10px 20px'}}>
            <Grid container spacing={ 2 }>
                <Grid item xs={12}>
                    <Typography variant='h1' component='h1'>Registro</Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Nombre" variant='filled' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Correo" variant='filled' fullWidth/>
                </Grid>
                <Grid item xs={12}>
                    <TextField label="Contrasenia" variant='filled' fullWidth type='password'/>
                </Grid>
                <Grid item xs={12}>
                    <Button color='secondary' className='circular-btn' size='large' fullWidth>
                        Registrarse
                    </Button>
                </Grid>
                <Grid item xs={12} display='flex' justifyContent={'end'}>
                    <NextLink href="/auth/login" passHref>
                        <Link underline='always'>
                            Ya tienes cuenta?
                        </Link>
                    </NextLink>


                </Grid>

            </Grid>
        </Box>

    </AuthLayout>
  )
}

export default RegisterPage;
