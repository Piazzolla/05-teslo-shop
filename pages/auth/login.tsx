import { useState } from 'react';
import NextLink from 'next/link';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from "../../components/layouts"
import { validations } from '../../utils';
import tesloApi from '../../api/tesloApi';

type FormData = {
    email: string,
    password: string,
};


export const LoginPage = () => {

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    
    const onLoginUser = async ({ email, password }: FormData) => {

        setShowError( false );
        
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;

        } catch (error) {
 //           console.log('Error en las credenciales')
            setShowError( true );
            setTimeout(() => {
                setShowError(false)
            }, 3000);
        }

    }
    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onLoginUser)} noValidate>

                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Iniciar Sesion</Typography>
                            <Chip 
                            label="No reconocemos ese usuario / password" 
                            color="error"
                            icon={<ErrorOutline />}
                            className="fadeIn" 
                            sx={{ display: showError ? 'flex' : 'none '}}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Correo" variant='filled' fullWidth type='email'
                                {
                                ...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Contrasenia" variant='filled' fullWidth type='password'
                                {
                                ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'Minimo 6 caracteres' }
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}


                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button color='secondary' className='circular-btn' size='large' fullWidth type='submit'>
                                Ingresar
                            </Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent={'end'}>
                            <NextLink href="/auth/register" passHref>
                                <Link underline='always'>
                                    No tienes cuenta?
                                </Link>
                            </NextLink>


                        </Grid>

                    </Grid>
                </Box>
            </form>

        </AuthLayout>
    )
}

export default LoginPage;
