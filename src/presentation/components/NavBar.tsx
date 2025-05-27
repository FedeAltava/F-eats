// src/presentation/components/NavBar.tsx
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}
        >
          F-eat
        </Typography>

        {name ? (
          <Box>
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
                <Button
                  color="inherit"
                  component={Link}
                  to="/register-restaurant"
                >
                  My Profile
                </Button>
              </>
            )}

            {role === "user" && (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/cart"
                >
                  Cart
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/profile"
                >
                  My Profile
                </Button>
              </>
            )}

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/signup">
              Sign Up (User)
            </Button>
            <Button color="inherit" component={Link} to="/signup-restaurant">
              Sign Up (Restaurant)
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login (User)
            </Button>
            <Button color="inherit" component={Link} to="/login-restaurant">
              Login (Restaurant)
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
