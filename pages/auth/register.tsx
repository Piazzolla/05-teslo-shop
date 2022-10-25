import { useState, useContext } from 'react';
import NextLink from 'next/link';
import { Box, Grid, Typography, TextField, Button, Link, Chip } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from "../../components/layouts"
import { tesloApi } from '../../api';
import { validations } from '../../utils';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/auth/AuthContext';


type FormData = {
    email: string,
    password: string,
    name: string
};


export const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext)

    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const onRegisterForm = async ({ email, password, name }: FormData) => {
        // cuando el registro es valido lo llamamos aca

        setShowError(false);
        const { hasError, message } = await registerUser(name, email, password);

        if( hasError ) {
            setShowError(true);
            setErrorMessage( message! );
            setTimeout(() => {
                setShowError(false)
            }, 3000);
            return;
        }

        router.replace('/');
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onRegisterForm)} noValidate>

                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Chip
                            label="Error en el registro"
                            color="error"
                            icon={<ErrorOutline />}
                            className="fadeIn"
                            sx={{ display: showError ? 'flex' : 'none ' }}
                        />
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Registro</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label="Nombre" variant='filled' fullWidth
                                {
                                ...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 2, message: 'Minimo 2 caracteres' }
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
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
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button color='secondary' className='circular-btn' size='large' fullWidth type='submit'>
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
            </form>

        </AuthLayout>
    )
}

export default RegisterPage;
