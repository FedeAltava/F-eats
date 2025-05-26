import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Box, TextField, Button, Alert } from "@mui/material";
import { FirebaseAuthRepository } from "../../infrastructure/repositories/FirebaseAuthRepository";
import { FirebaseUserRepository } from "../../infrastructure/repositories/FirebaseUserRepository";
import { SignUpUseCase } from "../../application/use-cases/auth/SignUpUseCase";
import { CreateUser }     from "../../application/use-cases/user/CreateUserUse-case";
import { User }           from "../../domain/entities/User";

export const SignUpUser = () => {
  const navigate = useNavigate();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async () => {
    setError(null);
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      // 1️⃣ Registro en Firebase Auth
      const authRepo = new FirebaseAuthRepository();
      const signUp   = new SignUpUseCase(authRepo);
      const uid      = await signUp.execute(email, password, "user");

   // 2️⃣ Crear entidad User y guardarla en Firestore
    const userEntity = User.create({ id: uid, name, email, password });
    const userRepo   = new FirebaseUserRepository();
    const createU    = new CreateUser(userRepo);
    await createU.execute(userEntity);

      navigate("/login");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError("Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" align="center">User Sign Up</Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="Name" value={name}         onChange={e => setName(e.target.value)}    fullWidth />
        <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
        <TextField label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} fullWidth />
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing Up…" : "Sign Up"}
        </Button>
      </Box>
    </Container>
  );
};
