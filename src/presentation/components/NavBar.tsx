// src/presentation/components/NavBar.tsx
import { useState, MouseEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  // Estados para los menús de Sign Up / Login
  const [anchorSignUp, setAnchorSignUp] = useState<HTMLElement | null>(null);
  const [anchorLogin, setAnchorLogin] = useState<HTMLElement | null>(null);

  const handleOpenSignUp = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorSignUp(e.currentTarget);
  };
  const handleCloseSignUp = () => {
    setAnchorSignUp(null);
  };

  const handleOpenLogin = (e: MouseEvent<HTMLButtonElement>) => {
    setAnchorLogin(e.currentTarget);
  };
  const handleCloseLogin = () => {
    setAnchorLogin(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Definimos a dónde apunta el logo según el estado de sesión
  const logoTo = (() => {
    if (!name) return "/"; // no está logueado: Home público
    if (role === "user") return "/"; 
    if (role === "restaurant") return "/profile-restaurant";
    return "/"; 
  })();

  return (
    <AppBar position="static">
      <Toolbar>
        {/* Logo / Título: aquí el 'to' es dinámico */}
        <Typography
          variant="h6"
          component={Link}
          to={logoTo}
          sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
        >
          F-eat
        </Typography>

        {name ? (
          /* Si está logueado, mostramos saludo y opciones según rol */
          <Box>
            <Typography component="span" sx={{ mr: 2 }}>
              Hello, {name}
            </Typography>

            {role === "restaurant" && (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to={`/restaurant/${localStorage.getItem("uid")}/manage-dishes`}
                >
                  My Dishes
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/orders-received"
                >
                  Orders Received
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/profile-restaurant"
                >
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
          </Box>
        ) : (
          /* Si NO está logueado, mostramos DOS botones: Sign Up y Login */
          <Box>
            {/* Botón “Sign Up” abre menú con dos opciones */}
            <Button color="inherit" onClick={handleOpenSignUp}>
              Sign Up
            </Button>
            <Menu
              anchorEl={anchorSignUp}
              open={Boolean(anchorSignUp)}
              onClose={handleCloseSignUp}
            >
              <MenuItem
                component={Link}
                to="/signup"
                onClick={handleCloseSignUp}
              >
                As User
              </MenuItem>
              <MenuItem
                component={Link}
                to="/signup-restaurant"
                onClick={handleCloseSignUp}
              >
                As Restaurant
              </MenuItem>
            </Menu>

            {/* Botón “Login” abre menú con dos opciones */}
            <Button color="inherit" onClick={handleOpenLogin}>
              Login
            </Button>
            <Menu
              anchorEl={anchorLogin}
              open={Boolean(anchorLogin)}
              onClose={handleCloseLogin}
            >
              <MenuItem
                component={Link}
                to="/login"
                onClick={handleCloseLogin}
              >
                As User
              </MenuItem>
              <MenuItem
                component={Link}
                to="/login-restaurant"
                onClick={handleCloseLogin}
              >
                As Restaurant
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
