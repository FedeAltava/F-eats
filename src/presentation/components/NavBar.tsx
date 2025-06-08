// src/presentation/components/NavBar.tsx
import React, { useState } from "react";
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

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

  const guestSignUpItems = [
    { text: "As User", to: "/signup" },
    { text: "As Restaurant", to: "/signup-restaurant" },
  ];
  const guestLoginItems = [
    { text: "As User", to: "/login" },
    { text: "As Restaurant", to: "/login-restaurant" },
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={closeDrawer}
      onKeyDown={closeDrawer}
    >
      {name ? (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1">Hello, {name}</Typography>
          </Box>
          <Divider />

          {role === "restaurant" ? (
            <List>
              {loggedRestItems.map((item) => (
                <ListItemButton component={Link} to={item.to} key={item.text}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          ) : (
            <List>
              {loggedUserItems.map((item) => (
                <ListItemButton component={Link} to={item.to} key={item.text}>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              ))}
            </List>
          )}

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
            <ListItemText
              primary="Sign Up"
              sx={{ pl: 2, pt: 1, fontWeight: "bold" }}
            />
            {guestSignUpItems.map((item) => (
              <ListItemButton component={Link} to={item.to} key={item.text} sx={{ pl: 4 }}>
                <ListItemText primary={item.text} />
              </ListItemButton>
            ))}
          </List>
          <Divider />
          <List>
            <ListItemText
              primary="Login"
              sx={{ pl: 2, pt: 1, fontWeight: "bold" }}
            />
            {guestLoginItems.map((item) => (
              <ListItemButton component={Link} to={item.to} key={item.text} sx={{ pl: 4 }}>
                <ListItemText primary={item.text} />
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

                  {role === "restaurant" && (
                    <>
                      <Button
                        color="inherit"
                        component={Link}
                        to={`/restaurant/${localStorage.getItem("uid")}/add-dish`}
                      >
                        Add Dish
                      </Button>
                      <Button color="inherit" component={Link} to="/orders-received">
                        Orders Received
                      </Button>
                      <Button color="inherit" component={Link} to="/profile-restaurant">
                        My Profile
                      </Button>
                    </>
                  )}

                  {role === "user" && (
                    <>
                      <Button color="inherit" component={Link} to="/cart">
                        Cart
                      </Button>
                      <Button color="inherit" component={Link} to="/my-orders">
                        My Orders
                      </Button>
                      <Button color="inherit" component={Link} to="/profile">
                        My Profile
                      </Button>
                    </>
                  )}

                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={Link} to="/signup">
                    Sign Up
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Login
                  </Button>
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
