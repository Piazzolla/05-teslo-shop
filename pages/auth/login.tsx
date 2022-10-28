import { GetServerSideProps } from 'next'
import { useState, useEffect } from 'react';
import NextLink from 'next/link';
import { getSession, signIn, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Box, Grid, Typography, TextField, Button, Link, Chip, Divider } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from "../../components/layouts"
import { validations } from '../../utils';

type FormData = {
    email: string,
    password: string,
};


export const LoginPage = () => {

    const router = useRouter()
//    const { asPath } = router;
    const dest = router.query.p?.toString() || '/';

    //const { loginUser } = useContext( AuthContext )

    
    const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [providers, setProviders] = useState<any>({}); /* uso any porque tipar lo que devuelve getProviderses un dolor  de cabeza 
                        function getProviders(): Promise<Record<LiteralUnion<BuiltInProviderType, string>,
    */
    
    useEffect(() => {
      getProviders().then( prov => {

        setProviders(prov);
      })
    
    }, [])
    

    const onLoginUser = async ({ email, password }: FormData) => {
        
        setShowError( false );
        
        // const isValidLogin =  await loginUser( email, password);
        // if ( !isValidLogin ) {
        //     setShowError( true );
        //     setTimeout(() => {
        //         setShowError(false)
        //     }, 3000);
        //     return;
        // }
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination); 

        await signIn('credentials', { email, password });
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
                            <NextLink href={`/auth/register?p=${dest}`} passHref>
                                <Link underline='always'>
                                    No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>
                        <Grid item xs={ 12 } display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }}  />
                            {
                                /* Uso Object.values para poder mapear los valores del objeto como si fuera un array */
                                Object.values( providers ).map( ( provider: any ) => {

                                    if ( provider.id === 'credentials') return (<div key='credentials'></div>)
                                    return (
                                        <Button
                                            key={ provider.id }
                                            variant="outlined"
                                            fullWidth
                                            color="primary"
                                            sx={{ mb: 1 }}
                                            onClick={() => signIn( provider.id )}
                                        >
                                            {provider.name}
                                        </Button>
                                    )
                                })
                            }
                        </Grid>

                    </Grid>
                </Box>
            </form>

        </AuthLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
/* esto lo voy a usar porque no quiero mostrar mi custom login si ya hay un usuario logueado
como se si hay un usuario en el lado del servidor porque me llega con las cookies
puedo ocuparme de que no muestre la LoginPage del lado del servidor */ 
export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });
    const { p = '/' } = query;

        if (session) {
            return {
                redirect: {
                    destination: p.toString(),
                    permanent: false
                }
            }
        } 

    return {
        props: {
            
        }
    }
}

export default LoginPage;
