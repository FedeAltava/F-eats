// src/presentation/pages/ProfileUser.tsx
import React, { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { getAuth, updateEmail, updatePassword } from "firebase/auth";

import { FirebaseUserRepository } from "../../infrastructure/repositories/FirebaseUserRepository";
import { UpdateUserUseCase } from "../../application/use-cases/user/UpdateUserUse-case";
import { User } from "../../domain/entities/User";

export const ProfileUser: React.FC = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const auth = getAuth();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1️⃣ Carga inicial: si no hay UID o no existe en Firestore, redirigir
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

  // 2️⃣ Manejar envío de cambios
  const handleSubmit = async () => {
    setError(null);
    setFeedback(null);

    if (!user) return;

    // Recopilamos solo los campos que cambian
    const data: { name?: string; email?: string; password?: string } = {};
    if (name.trim() && name !== user.name.value) {
      data.name = name.trim();
    }
    if (email.trim() && email !== user.email.value) {
      data.email = email.trim();
    }
    if (password.trim().length > 0) {
      data.password = password.trim();
    }

    // Si no hay cambios, no hacemos nada
    if (Object.keys(data).length === 0) {
      setFeedback("No changes to save.");
      return;
    }

    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("User not authenticated");
      }

      // 2.1️⃣ Si cambió el email, primero actualizamos en Firebase Auth
      if (data.email) {
        await updateEmail(currentUser, data.email);
      }

      // 2.2️⃣ Si cambió la contraseña, actualizamos en Firebase Auth
      if (data.password) {
        // Nota: Firebase Auth exige que el usuario se haya autenticado recientemente.
        // Si recibes el error "requires-recent-login", tendrás que forzar un re-login
        await updatePassword(currentUser, data.password);
      }

      // 2.3️⃣ Ahora que Auth está actualizado, actualizamos el documento en Firestore
      //   (puede incluir tanto el email modificado como el password, si lo guardas en Firestore,
      //    pero muchas veces NO es aconsejable guardar la contraseña en texto plano.
      //    Si solo usas Auth, podrías omitir guardar password en Firestore.)

      const repo = new FirebaseUserRepository();
      const uc = new UpdateUserUseCase(repo);
      await uc.execute(uid!, data);

      // 2.4️⃣ Si cambió el nombre, actualizamos localStorage para que el NavBar se refresque
      if (data.name) {
        localStorage.setItem("name", data.name);
      }

      setFeedback("Profile updated successfully.");
      setPassword(""); // Limpiamos el campo de password
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Capturamos errores de Auth (por ejemplo, "requires-recent-login"),
      // o errores de Firestore. Mostramos el mensaje al usuario.
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Mientras cargamos al usuario, no renderizamos nada
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
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
