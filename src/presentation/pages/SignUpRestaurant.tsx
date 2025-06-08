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
  const [rating] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const title = "Restaurant Sign Up";
  const len = title.length;
  const handleSubmit = async () => {
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const authRepo = new FirebaseAuthRepository();
      const signUpUC = new SignUpUseCase(authRepo);
      const uid = await signUpUC.execute(email, password, "restaurant");

      const restaurantEntity = Restaurant.create({
        id: uid,
        name,
        email,
        password,
        category,
        rating,
        imageUrl,
        menu: [],
      });
      const restRepo = new FirebaseRestaurantRepository();
      const createRest = new CreateRestaurant(restRepo);
      await createRest.execute(restaurantEntity);

      localStorage.setItem("uid", uid);
      localStorage.setItem("role", "restaurant");
      localStorage.setItem("name", name);

      navigate("/profile-restaurant");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError("Failed to sign up restaurant");
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
          Restaurant Sign Up
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
          label="Confirm PW"
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
          {loading ? "Signing Up…" : "Sign Up as Restaurant"}
        </Button>
      </Box>
    </Container>
  );
};
