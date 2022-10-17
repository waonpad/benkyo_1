import React, { useEffect, useState, ReactNode } from 'react';
import { alpha, makeStyles, Theme, useTheme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { Badge } from '@mui/material'; // @material-ui/core/だと怒られる
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Home, Chat, Forum, Group, Login, PersonAdd } from '@mui/icons-material';
import { Settings } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import ReactLoading from 'react-loading';
import ReactDOM from 'react-dom';
import { Button, Card } from '@material-ui/core';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { Link, useHistory } from "react-router-dom";
import axios from 'axios';
import swal from 'sweetalert';

import { useAuth } from "../AuthContext";

interface Props {
  children: ReactNode
}

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    grow: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      // md以上はコンテンツが動く、未満は被さる
      [theme.breakpoints.up('md')]: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }
    },
  }),
);

export default function Header({children}: Props) {

  // original
  
  const history = useHistory();
  const auth = useAuth();

  const [unread_notifications, setUnreadNotifications] = useState<any>();

	useEffect(() => {
    if(auth!.user !== null) {
        axios.get('/api/unreadnotifications').then(res => {
            if (res.status === 200) {
                console.log(res);
                setUnreadNotifications(res.data.unread_notifications);

                // setInitialLoad(false);
            }
        }).catch((error) => {
            // console.log(error);
            // setInitialLoad(false);
        });

        window.Echo.private('App.Models.User.' + auth!.user!.id)
        .notification((notification: any) => {
            console.log(notification);
            setUnreadNotifications([...unread_notifications, notification]);
        })
    }

    // readNotification("37d6b77b-ec53-4858-b0e4-ab9eaa5d4e07");

    // readAllNotifications();
  }, [auth!.user])


  const readNotification = (notification_id: any) => {
    axios.post('/api/readnotification', {notification_id: notification_id}).then(res => {
        if (res.status === 200) {
            console.log(res);
        }
    }).catch((error) => {
        console.log(error);
    })
  }

  const readAllNotifications = () => {
    axios.post('/api/readallnotifications').then(res => {
        if (res.status === 200) {
            console.log(res);
        }
    }).catch((error) => {
        console.log(error);
    })
  }

  const logout = () => {
    axios.get('/sanctum/csrf-cookie').then(() => {
    auth?.signout().then(() => {
        swal("ログアウトしました", "ログアウト成功", "success");
        history.push('/');
    })
    })
  }

  // mui temp

  // drawer
  
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    open ? setOpen(false) : setOpen(true);
  };

  // app bar

  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [settingAnchorEl, setSettingAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isSettingMenuOpen = Boolean(settingAnchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSettingAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSettingAnchorEl(null)
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      <MenuItem onClick={logout}>Log Out</MenuItem>
    </Menu>
  );

  const settingMenuId = 'primary-search-setting-menu';
  const renderSettingMenu = (
    <Menu
      anchorEl={settingAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={settingMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isSettingMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to={'/setting'} style={{ textDecoration: 'none', color: 'inherit' }}>Setting</MenuItem>
      <MenuItem onClick={handleMenuClose} component={Link} to={'/about'} style={{ textDecoration: 'none', color: 'inherit' }}>About</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = !localStorage.getItem('auth_token') ? (
    // ログインしていない
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={handleMenuClose} component={Link} to={'/login'} style={{ textDecoration: 'none', color: 'inherit' }}>
        <IconButton aria-label="go to login" color="inherit">
            <Login />
        </IconButton>
        <Typography>Login</Typography>
      </MenuItem>
      <MenuItem onClick={handleMenuClose} component={Link} to={'/register'} style={{ textDecoration: 'none', color: 'inherit' }}>
        <IconButton aria-label="go to register" color="inherit">
            <PersonAdd />
        </IconButton>
        <Typography>Register</Typography>
      </MenuItem>
      {/* <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem> */}
    </Menu>
  ) : (
    // ログインしている
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* <MenuItem>
        <IconButton aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem> */}
      <MenuItem aria-label="show new notifications" component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
        <IconButton color="inherit">
          <Badge badgeContent={unread_notifications ? Object.keys(unread_notifications).length : 0} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Typography>Notifications</Typography>
      </MenuItem>
      <MenuItem aria-label='go to current user' component={Link} to={'/user/' + auth!.user!.screen_name} style={{ textDecoration: 'none', color: "inherit" }}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <Typography>Profile</Typography>
      </MenuItem>
      <MenuItem>
        <IconButton
          edge="end"
          aria-label="show setting and others"
          aria-controls={settingMenuId}
          aria-haspopup="true"
          onClick={handleSettingMenuOpen}
          color="inherit"
        >
          <Settings />
        </IconButton>
      </MenuItem>
    </Menu>
  )

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar 
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={clsx(classes.menuButton, open)}
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap component={Link} to={'/'} style={{ textDecoration: 'none', color: 'inherit' }}>
            Material-UI
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={classes.grow} />

          {!localStorage.getItem('auth_token') ? (
            // ログインしていない
            <div className={classes.sectionDesktop}>
                <Button component={Link} to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>Login</Button>
                <Button component={Link} to='/register' style={{ textDecoration: 'none', color: 'inherit' }}>Register</Button>
              {/* <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton> */}
            </div>
          ) : (
            // ログインしている
            // https://zenn.dev/cryptobox/articles/2dc6fe0951eeca

            <div className={classes.sectionDesktop}>
              {/* <IconButton aria-label="show 4 new mails" component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton> */}
              
              <IconButton aria-label="show new notifications" component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
                <Badge badgeContent={unread_notifications ? Object.keys(unread_notifications).length : 0} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <IconButton aria-label='go to current user' component={Link} to={'/user/' + auth!.user!.screen_name} style={{ textDecoration: 'none', color: "inherit" }}>
                <AccountCircle />
              </IconButton>

              {/* <IconButton aria-label='go to setting' component={Link} to={'/setting'} style={{ textDecoration: 'none', color: "inherit" }}>
                <Settings />
              </IconButton> */}

              <IconButton
                edge="end"
                aria-label="show setting and others"
                aria-controls={settingMenuId}
                aria-haspopup="true"
                onClick={handleSettingMenuOpen}
                color="inherit"
              >
                <Settings />
              </IconButton>

              {/* <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton> */}
            </div>
          )}

          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant='persistent'
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerOpen}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to='/' style={{ textDecoration: 'none', color: "inherit" }}>
            <ListItemIcon><Home /></ListItemIcon>
            <ListItemText primary='Home'></ListItemText>
          </ListItem>
          <ListItem button component={Link} to='/chat' style={{ textDecoration: 'none', color: "inherit" }}>
            <ListItemIcon><Chat /></ListItemIcon>
            <ListItemText primary='Chat'></ListItemText>
          </ListItem>
          <ListItem button component={Link} to='/privatechat/waonpad' style={{ textDecoration: 'none', color: "inherit" }}>
            <ListItemIcon><Forum /></ListItemIcon>
            <ListItemText primary='Private Chat'></ListItemText>
          </ListItem>
          <ListItem button component={Link} to='/groupchat/test' style={{ textDecoration: 'none', color: "inherit" }}>
            <ListItemIcon><Group /></ListItemIcon>
            <ListItemText primary='Group Chat'></ListItemText>
          </ListItem>


          {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))} */}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
      {renderMobileMenu}
      {renderMenu}
      {renderSettingMenu}
    </div>
  );
}
