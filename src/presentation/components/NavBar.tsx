// src/presentation/components/NavBar.tsx
import React, { useState, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorSignUp, setAnchorSignUp] = useState<HTMLElement | null>(null);
  const [anchorLogin, setAnchorLogin] = useState<HTMLElement | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const handleOpenSignUp = (e: MouseEvent<HTMLElement>) => setAnchorSignUp(e.currentTarget);
  const handleCloseSignUp = () => setAnchorSignUp(null);

  const handleOpenLogin = (e: MouseEvent<HTMLElement>) => setAnchorLogin(e.currentTarget);
  const handleCloseLogin = () => setAnchorLogin(null);

  // Opciones según rol
  const loggedUserItems = [
    { text: "Cart", to: "/cart" },
    { text: "My Orders", to: "/my-orders" },
    { text: "My Profile", to: "/profile" },
  ];
  const loggedRestItems = [
    { text: "Add Dish", to: `/restaurant/${localStorage.getItem("uid")}/add-dish` },
    { text: "Orders Received", to: "/orders-received" },
    { text: "My Profile", to: "/profile-restaurant" },
  ];

  // Drawer para mobile
  const guestSignUpItems = [
    { text: "As User", to: "/signup" },
    { text: "As Restaurant", to: "/signup-restaurant" },
  ];
  const guestLoginItems = [
    { text: "As User", to: "/login" },
    { text: "As Restaurant", to: "/login-restaurant" },
  ];

  const drawerContent = (
    <Box sx={{ width: 250 }} onClick={closeDrawer} onKeyDown={closeDrawer}>
      {name ? (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1">Hello, {name}</Typography>
          </Box>
          <Divider />
          <List>
            {(role === "restaurant" ? loggedRestItems : loggedUserItems).map((item) => (
              <ListItemButton component={Link} to={item.to} key={item.text}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </>
      ) : (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1">Welcome</Typography>
          </Box>
          <Divider />
          <List>
            <Typography sx={{ pl: 2, pt: 1, fontWeight: "bold" }}>Sign Up</Typography>
            {guestSignUpItems.map((i) => (
              <ListItemButton component={Link} to={i.to} key={i.text} sx={{ pl: 4 }}>
                <ListItemText primary={i.text} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <Typography sx={{ pl: 2, pt: 1, fontWeight: "bold" }}>Login</Typography>
            {guestLoginItems.map((i) => (
              <ListItemButton component={Link} to={i.to} key={i.text} sx={{ pl: 4 }}>
                <ListItemText primary={i.text} />
              </ListItemButton>
            ))}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
          >
            Feats
          </Typography>

          {isMobile ? (
            <IconButton color="inherit" edge="end" onClick={openDrawer}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {name ? (
                <>
                  <Typography component="span" sx={{ mr: 2 }}>
                    Hello, {name}
                  </Typography>
                  {(role === "restaurant" ? loggedRestItems : loggedUserItems).map((item) => (
                    <Button
                      color="inherit"
                      component={Link}
                      to={item.to}
                      key={item.text}
                    >
                      {item.text}
                    </Button>
                  ))}
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" onClick={handleOpenSignUp}>
                    Sign Up
                  </Button>
                  <Menu
                    anchorEl={anchorSignUp}
                    open={Boolean(anchorSignUp)}
                    onClose={handleCloseSignUp}
                  >
                    {guestSignUpItems.map((i) => (
                      <MenuItem
                        component={Link}
                        to={i.to}
                        onClick={handleCloseSignUp}
                        key={i.text}
                      >
                        {i.text}
                      </MenuItem>
                    ))}
                  </Menu>

                  <Button color="inherit" onClick={handleOpenLogin}>
                    Login
                  </Button>
                  <Menu
                    anchorEl={anchorLogin}
                    open={Boolean(anchorLogin)}
                    onClose={handleCloseLogin}
                  >
                    {guestLoginItems.map((i) => (
                      <MenuItem
                        component={Link}
                        to={i.to}
                        onClick={handleCloseLogin}
                        key={i.text}
                      >
                        {i.text}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={closeDrawer}>
        {drawerContent}
      </Drawer>
    </>
  );
};
