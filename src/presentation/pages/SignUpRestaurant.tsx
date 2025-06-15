// src/presentation/pages/SignUpRestaurant.tsx
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
import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";
import { SignUpUseCase } from "../../application/use-cases/auth/SignUpUseCase";
import { CreateRestaurant } from "../../application/use-cases/restaurant/CreateRestaurantUse-case";
import { Restaurant } from "../../domain/entities/Restaurant";
import { orange } from "@mui/material/colors";

export const SignUpRestaurant = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [category, setCategory] = useState("");
  const rating = useState<number | "">("");
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!name.trim()) {
      throw new Error("Name is required");
    }
    if (!email.trim()) {
      throw new Error("Email is required");
    }
    // Podrías usar aquí tu EmailVO para validar formato
    if (!password) {
      throw new Error("Password is required");
    }
    if (password !== confirm) {
      throw new Error("Passwords do not match");
    }
    if (!category.trim()) {
      throw new Error("Category is required");
    }

    if (!imageUrl.trim()) {
      throw new Error("Image URL is required");
    }
  };

  const handleSubmit = async () => {
    setError(null);

    try {
      validateInputs();

      setLoading(true);

      // 1️⃣ Registra en Auth
      const authRepo = new FirebaseAuthRepository();
      const signUpUC = new SignUpUseCase(authRepo);
      const uid = await signUpUC.execute(email, password, "restaurant");

      // guardamos en localStorage para que ProtectedRoute funcione
      localStorage.setItem("uid", uid);
      localStorage.setItem("role", "restaurant");
      localStorage.setItem("name", name);

      // 2️⃣ Creamos y persistimos la entidad Restaurant
      const restaurantEntity = Restaurant.create({
        id: uid,
        name,
        email,
        password,
        category,
        rating: Number(rating),
        imageUrl,
        menu: [],
      });
      const restRepo = new FirebaseRestaurantRepository();
      const createRest = new CreateRestaurant(restRepo);
      await createRest.execute(restaurantEntity);

      // 3️⃣ Redirigir al profile
      navigate("/profile-restaurant");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Aquí mostramos el mensaje específico
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={6} display="flex" flexDirection="column" gap={2}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: orange[600],
            fontFamily: "Courier, monospace",
          }}
        >
          Restaurant SignUp
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
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        />

        <TextField
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={handleSubmit} disabled={loading}>
          {loading ? "Signing Up…" : "Sign Up"}
        </Button>
      </Box>
    </Container>
  );
};
