import { useState, useEffect, useContext } from 'react';
import NextLink from 'next/link';
import { AppBar, Toolbar, Link, Box, Button, IconButton, Badge, Typography, Input, InputAdornment } from "@mui/material"
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { UiContext } from '../../context';
import { CartContext } from '../../context/cart/CartContext';


export const Navbar = () => {

    const { asPath, push: routerPush } = useRouter();

    const [activeGender, setActiveGender] = useState('');
    const { toggleSideMenu } = useContext(UiContext);
    const { numberOfItems } = useContext(CartContext);

    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchVisible, setIsSearchVisible] = useState(false)

    
    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        routerPush(`/search/${ searchTerm }`);
    }


    useEffect(() => {

        const splittedPath = asPath.split('/');
        let gender = '';
        if (splittedPath.includes('category')) {
            gender = splittedPath[splittedPath.length - 1]
        }
        setActiveGender(gender);

    }, [asPath])

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>TesloShop!</Typography>
                        <Typography sx={{ marginLeft: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>


                <Box flex={1} />

                <Box sx={{ display: isSearchVisible? 'none' : { xs: 'none', sm: 'block' } }}
                    className='fadeIn'
                >
                    <NextLink href='/category/men'>
                        <Link>
                            <Button color={activeGender === 'men' ? 'primary' : 'info'}>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/women'>
                        <Link>
                            <Button color={activeGender === 'women' ? 'primary' : 'info'}>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid'>
                        <Link>
                            <Button color={activeGender === 'kid' ? 'primary' : 'info'}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>
                <Box flex={1} />

                {
                    isSearchVisible ? (

                        // Pantallas grandes
                        <Input
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setIsSearchVisible(false)}
                                    >
                                        <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />) : (
                        <IconButton
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            onClick={() => setIsSearchVisible(true)}
                            className='fadeIn'
                        >
                            <SearchOutlined />
                        </IconButton>
                    )
                }
                {/* Pantallas pequenias */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref>

                    <Link>
                        <IconButton>
                            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary'>
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>

                <Button onClick={toggleSideMenu} >
                    Menu
                </Button>

            </Toolbar>

        </AppBar>
    )
}
