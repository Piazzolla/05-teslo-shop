import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { useRouter } from "next/router";
import { AuthContext, UiContext } from "../../context";
import { useContext, useEffect, useRef, useState } from 'react';

export const SideMenu = () => {

    const router = useRouter();

    const { asPath } = router;
    const { isLoggedIn, user, logout } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('')

    const { isMenuOpen, toggleSideMenu } = useContext(UiContext);

    const navigateTo = (url: string) => {
        toggleSideMenu();
        router.push(url);
    }

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        navigateTo(`/search/${searchTerm}`);

    }

    const onLogout = () => {
        logout();
    }

    const inputEl = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputEl.current != null) {
            if (isMenuOpen) {
                inputEl.current.focus();
            }
        }
    }, [isMenuOpen])


    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
            onClose={toggleSideMenu}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>

                <List>

                    <ListItem>
                        <Input
                            ref={inputEl}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' ? onSearchTerm() : null}
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onSearchTerm}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    {
                        isLoggedIn && (
                            <>

                                <ListItemButton>
                                    <ListItemIcon>
                                        <AccountCircleOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItemButton>

                                <ListItemButton onClick={() => navigateTo('/orders/history') } >
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItemButton>
                            </>
                        )
                    }


                    <ListItemButton
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={(event) => navigateTo('/category/men')}
                    >
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItemButton>

                    <ListItemButton
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={(event) => navigateTo('/category/women')}
                    >
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItemButton>

                    <ListItemButton
                        sx={{ display: { xs: '', sm: 'none' } }}
                        onClick={(event) => navigateTo('/category/kid')}
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItemButton>


                    {
                        isLoggedIn ? (
                            <ListItemButton onClick={ onLogout }>
                                <ListItemIcon>
                                    <LoginOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItemButton>
                        ) : (
                            <ListItemButton onClick={ () => navigateTo(`/auth/login?p=${ router.asPath }`) }>
                                <ListItemIcon>
                                    <VpnKeyOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Ingresar'} />
                            </ListItemButton>
                        )
                    }




                    {/* Admin - deberia construirlo como un componente */}

                    {
                        user?.role === 'admin' && (<>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItemButton>
                                <ListItemIcon>
                                    <CategoryOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Productos'} />
                            </ListItemButton>
                            <ListItemButton>
                                <ListItemIcon>
                                    <ConfirmationNumberOutlined />
                                </ListItemIcon>
                                <ListItemText primary={'Ordenes'} />
                            </ListItemButton>

                            <ListItemButton>
                                <ListItemIcon>
                                    <AdminPanelSettings />
                                </ListItemIcon>
                                <ListItemText primary={'Usuarios'} />
                            </ListItemButton>
                        </>)
                    }
                </List>
            </Box>
        </Drawer>
    )
}