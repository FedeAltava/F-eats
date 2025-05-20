
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

export const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>

        <Typography variant="h6" component={Link} to="/" sx={{ textDecoration: "none", color: "inherit", flexGrow: 1 }}>
          F-eat
        </Typography>


        <Box>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/cart">
            Cart
          </Button>
          <Button color="inherit" component={Link} to="/signup">
            Sign Up (User)
          </Button>
          <Button color="inherit" component={Link} to="/login">
            Login (User)
          </Button>
          <Button color="inherit" component={Link} to="/signup-restaurant">
            Sign Up (Restaurant)
          </Button>
          <Button color="inherit" component={Link} to="/login-restaurant">
            Login (Restaurant)
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
