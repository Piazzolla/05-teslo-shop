import { useState, useEffect, useContext } from 'react';
import NextLink from 'next/link';
import { AppBar, Toolbar, Link, Box, Button, IconButton, Badge,Typography } from "@mui/material"
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { UiContext } from '../../context';


export const Navbar = () => {

    const [activeGender, setActiveGender] = useState('');

    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

    const { asPath }= useRouter();
    
    useEffect(() => {
        
        const splittedPath = asPath.split('/');
        let gender = '';
        if( splittedPath.includes('category') ){
            gender = splittedPath[splittedPath.length - 1]
        }
        setActiveGender(gender);
    
    }, [ asPath ])
    
    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo</Typography>
                        <Typography sx={{ marginLeft: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>


                <Box flex={1} />

                <Box sx={{ display: { xs: 'none', sm: 'block'}}}>
                    <NextLink href='/category/men'>
                        <Link>
                            <Button color={ activeGender === 'men'? 'primary' : 'info'}>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women'>
                        <Link>
                            <Button color={ activeGender === 'women'? 'primary' : 'info'}>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid'>
                        <Link>
                            <Button color={ activeGender === 'kid'? 'primary' : 'info'}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>
                <Box flex={1} />

                <IconButton>
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref>

                    <Link>
                        <IconButton>
                            <Badge badgeContent={2} color='secondary'>
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={ toggleSideMenu } >
                    Menu
                </Button>

            </Toolbar>

        </AppBar>
    )
}
