
import { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FirebaseUserRepository } from "../../infrastructure/repositories/FirebaseUserRepository";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUse-case";
import { User } from "../../domain/entities/User";

export const ProfileUser = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const [user, setUser]         = useState<User | null>(null);
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);


  useEffect(() => {
    (async () => {
      if (!uid) { navigate("/login"); return; }
      const repo = new FirebaseUserRepository();
      const u = await repo.findById(uid);
      if (!u) { navigate("/login"); return; }
      setUser(u);
      setName(u.name.value);
      setEmail(u.email.value);
    })();
  }, [uid, navigate]);


  const handleSubmit = async () => {
    setError(null);
    setFeedback(null);


    const data: { name?: string; email?: string; password?: string } = {};
    if (name !== user?.name.value)       data.name     = name;
    if (email !== user?.email.value)     data.email    = email;
    if (password.trim().length > 0)      data.password = password;


    if (!Object.keys(data).length) {
      setFeedback("No changes to save.");
      return;
    }

    setLoading(true);
    try {
      const repo = new FirebaseUserRepository();
      const uc   = new UpdateUserUseCase(repo);
      await uc.execute(uid!, data);


      if (data.name) localStorage.setItem("name", data.name);

      setFeedback("Profile updated successfully.");
      setPassword("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Container maxWidth="sm">
      <Box mt={5} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" align="center">My Profile</Typography>
        {error    && <Alert severity="error">{error}</Alert>}
        {feedback && <Alert severity="success">{feedback}</Alert>}

        <TextField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="New Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          helperText="Leave blank to keep current password"
          fullWidth
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Container>
  );
};
