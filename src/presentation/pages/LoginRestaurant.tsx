import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { FirebaseAuthRepository } from "../../infrastructure/repositories/FirebaseAuthRepository";
import { SignInUseCase } from "../../application/use-cases/auth/SignInUseCase";
import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";
import { orange } from "@mui/material/colors";

export const LoginRestaurant = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const title = "Restaurant Login";
  const len = title.length;
  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const authRepo = new FirebaseAuthRepository();
      const signIn = new SignInUseCase(authRepo);
      const { uid, role } = await signIn.execute(email, password);

      if (role !== "restaurant") {
        setError("This account is not a restaurant");
        setLoading(false);
        return;
      }

      localStorage.setItem("uid", uid);
      localStorage.setItem("role", role);

      const restaurantRepo = new FirebaseRestaurantRepository();
      const restaurant = await restaurantRepo.getById(uid);
      if (restaurant) {
        localStorage.setItem("name", restaurant.name.value);
      }
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError("Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} display="flex" flexDirection="column" gap={2}>
        <Typography
          variant="h2"
          align="center"
          gutterBottom
          sx={{
            color: orange[600],
            fontFamily: "Courier, monospace",
            whiteSpace: "nowrap",
            overflow: "hidden",
            width: 0,
            mx: "auto",
            "@keyframes typing": {
              from: { width: 0 },
              to: { width: `${len}ch` },
            },
            "@keyframes blink": {
              "0%, 49%": { borderColor: "transparent" },
              "50%, 100%": { borderColor: orange[600] },
            },
            animation: `typing 2s steps(${len}) forwards`,
          }}
        >
          Restaurant Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing In…" : "Sign In as Restaurant"}
        </Button>
      </Box>
    </Container>
  );
};
