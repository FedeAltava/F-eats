// src/presentation/pages/LoginUser.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert
} from "@mui/material";
import { FirebaseAuthRepository } from "../../infrastructure/repositories/FirebaseAuthRepository";
import { SignInUseCase } from "../../application/use-cases/auth/SignInUseCase";

export const LoginUser = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const authRepo = new FirebaseAuthRepository();
      const signIn   = new SignInUseCase(authRepo);
      const { uid, role } = await signIn.execute(email, password);

      // guardas en localStorage o en contexto
      localStorage.setItem("uid", uid);
      localStorage.setItem("role", role);

      navigate("/home");
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
        <Typography variant="h4" align="center">User Login</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Signing In…" : "Sign In"}
        </Button>
      </Box>
    </Container>
  );
};
