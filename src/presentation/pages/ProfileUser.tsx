/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import { FirebaseUserRepository } from "../../infrastructure/repositories/FirebaseUserRepository";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUse-case";
import { User } from "../../domain/entities/User";

export const ProfileUser: React.FC = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const uid = localStorage.getItem("uid");

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    (async () => {
      if (!uid) {
        navigate("/login");
        return;
      }
      const repo = new FirebaseUserRepository();
      const u = await repo.findById(uid);
      if (!u) {
        navigate("/login");
        return;
      }
      setUser(u);
      setName(u.name.value);
      setEmail(u.email.value);
    })();
  }, [uid, navigate]);


  const handleChangeName = async () => {
    setError(null);
    setFeedback(null);

    if (!user) return;
    const trimmed = name.trim();
    if (trimmed === user.name.value) {
      setFeedback("No changes to name.");
      return;
    }

    setLoading(true);
    try {
      const repo = new FirebaseUserRepository();
      const uc = new UpdateUserUseCase(repo);
      await uc.execute(uid!, { name: trimmed });
      localStorage.setItem("name", trimmed);
      setFeedback("Name updated successfully.");
    } catch (err: any) {
      setError(err.message || "Failed to update name");
    } finally {
      setLoading(false);
    }
  };


  const handleChangePassword = async () => {
    setError(null);
    setFeedback(null);

    if (!user) return;
    const currentEmail = user.email.value;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, currentEmail);
      setFeedback("A password-reset link has been sent to your email.");
      setPasswordInput("");
    } catch (err: any) {
      setError(err.message || "Failed to send password-reset email");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <Box mt={5} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" align="center">
          My Profile
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {feedback && <Alert severity="success">{feedback}</Alert>}


        <TextField
          label="Email"
          type="email"
          value={email}
          disabled
          fullWidth
        />


        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={handleChangeName}
            disabled={loading}
          >
            Change Name
          </Button>
        </Box>


        <Box display="flex" alignItems="center" gap={1} >
          <TextField
            label="(Enter current password to reset)"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            helperText="Leave blank to skip"
            fullWidth
          />
          <Button
            variant="outlined"
            onClick={handleChangePassword}
            disabled={loading}
            sx={{ mb: 3 }}
          >
            Change Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
};
