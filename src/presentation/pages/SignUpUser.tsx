// src/presentation/pages/SignUpUser.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { orange } from "@mui/material/colors";

import { FirebaseAuthRepository } from "../../infrastructure/repositories/FirebaseAuthRepository";
import { FirebaseUserRepository } from "../../infrastructure/repositories/FirebaseUserRepository";
import { SignUpUseCase } from "../../application/use-cases/auth/SignUpUseCase";
import { CreateUser } from "../../application/use-cases/user/CreateUserUse-case";
import { User } from "../../domain/entities/User";

export const SignUpUser: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);




  const validateInputs = () => {
    if (!name.trim()) {
      throw new Error("Name is required");
    }
    if (!email.trim()) {
      throw new Error("Email is required");
    }

    if (!password) {
      throw new Error("Password is required");
    }
    if (password !== confirm) {
      throw new Error("Passwords do not match");
    }
  };


  const handleSubmit = async () => {
    setError(null);
    try {
      validateInputs();
      setLoading(true);


      const authRepo = new FirebaseAuthRepository();
      const signUpUC = new SignUpUseCase(authRepo);
      const uid = await signUpUC.execute(email, password, "user");


      localStorage.setItem("uid", uid);
      localStorage.setItem("role", "user");
      localStorage.setItem("name", name);

      const userEntity = User.create({ id: uid, name, email, password });
      const userRepo   = new FirebaseUserRepository();
      const createU    = new CreateUser(userRepo);
      await createU.execute(userEntity);


      navigate("/profile");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

      setError(err.message || "Unknown error");
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

          }}
        >
          User SingUp
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
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
        <TextField
          label="Confirm Password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing Up…" : "Sign Up"}
        </Button>
      </Box>
    </Container>
  );
};
