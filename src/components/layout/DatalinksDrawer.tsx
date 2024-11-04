import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {useAppSelector} from "../../hooks.ts";
import PersonIcon from '@mui/icons-material/Person';
import {UserLevel} from "../../model/user/UserLevel.ts";
import HouseIcon from '@mui/icons-material/House';
import {Link, useNavigate} from 'react-router-dom';
import LoginModal from "../LoginModal.tsx";
import {useTranslation} from "react-i18next";
import {useCookies} from "react-cookie";
import {setLoggedToken, setLoggedUser} from "../../redux/loggedUserSlice.ts";
import {newUser} from "../../model/user/User.ts";
import {useDispatch} from "react-redux";

const drawerWidth = 240;

interface Props {
    window?: () => Window;
    children?: React.ReactNode;
}

export default function DatalinksDrawer(props: Props) {

    const { window } = props;
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(false);

    const loggedUser = useAppSelector((state) => state.loggedUser);
    const navigate = useNavigate();
    const [_cookies, setCookie] = useCookies(['loginToken']);

    const dispatch = useDispatch();

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const clickLogin = () => {
        handleDrawerClose();
        setShowLogin(true);
    }

    const clickLogout = () => {
        handleDrawerClose();
        setCookie('loginToken', '', {path: '/'});
        dispatch(setLoggedUser(newUser()));
        dispatch(setLoggedToken(''));

        navigate('/');
    }

    const clickUser = () => {
        handleDrawerClose();
        navigate('/user/' + loggedUser.user.username);
    }

    const clickSignup = () => {
        handleDrawerClose();
        navigate('/signup');
    }

    const drawer = (
        <div>
            <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
            <Link to='/' onClick={handleDrawerClose}>
                <img id="site-logo" src={'/images/datalinks.svg'} alt={t("Site logo")} />
            </Link>
            <List>
                <ListItem key='frontpage' disablePadding onClick={() => { navigate('/'); handleDrawerClose();}}>
                    <ListItemButton>
                        <ListItemIcon>
                            <HouseIcon />
                        </ListItemIcon>
                        <ListItemText primary={t("Front page")} />
                    </ListItemButton>
                </ListItem>
            </List>
            <Divider/>
            <List>
                {loggedUser.user.userLevel == UserLevel.guest &&
                    <>
                        <ListItem key='login' disablePadding onClick={clickLogin}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PersonIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("Log in or sign in")} />
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='signup' disablePadding onClick={clickSignup}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PersonIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("Sign up")} />
                            </ListItemButton>
                        </ListItem>
                    </>}
                {loggedUser.user.userLevel != UserLevel.guest &&
                    <>
                        <ListItem key='user' disablePadding onClick={clickUser}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PersonIcon/>
                                </ListItemIcon>
                                <ListItemText primary={loggedUser.user.username}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem key='logout' disablePadding onClick={clickLogout}>
                            <ListItemButton>
                                <ListItemIcon>
                                    <PersonIcon/>
                                </ListItemIcon>
                                <ListItemText primary={t("Log out")}/>
                            </ListItemButton>
                        </ListItem>
                    </>}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        {import.meta.env.VITE_SITE_TITLE}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                {props.children}
            </Box>
        </Box>
    );
}