
import { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";
import { UpdateRestaurant } from "../../application/use-cases/restaurant/UpdateRestaurantUse-case";
import { Restaurant } from "../../domain/entities/Restaurant";
import { RestaurantUpdateData } from "../../domain/entities/Restaurant";

export const ProfileRestaurant = () => {
  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating]     = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");

  const [error, setError]       = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  // 1️⃣ Cargar restaurante al montar
  useEffect(() => {
    (async () => {
      if (!uid) {
        navigate("/login-restaurant");
        return;
      }
      const repo = new FirebaseRestaurantRepository();
      const r = await repo.getById(uid);
      if (!r) {
        navigate("/login-restaurant");
        return;
      }
      setRestaurant(r);
      // pre-llenar campos
      setName(r.name.value);
      setEmail(r.email.value);
      setCategory(r.category.value);
      setRating(r.rating.value);
      setImageUrl(r.imageUrl.value);
    })();
  }, [uid, navigate]);

  // 2️⃣ Enviar sólo los campos que han cambiado
  const handleSave = async () => {
    setError(null);
    setFeedback(null);
    if (!restaurant) return;

    const data: RestaurantUpdateData = {};
    if (name     !== restaurant.name.value)     data.name     = name;
    if (email    !== restaurant.email.value)    data.email    = email;
    if (password.trim().length > 0)             data.password = password;
    if (category !== restaurant.category.value) data.category = category;
    if (rating   !== restaurant.rating.value)   data.rating   = rating;
    if (imageUrl !== restaurant.imageUrl.value) data.imageUrl = imageUrl;

    if (Object.keys(data).length === 0) {
      setFeedback("No changes to save.");
      return;
    }

    setLoading(true);
    try {
      // 3️⃣ Construir nueva entidad y llamar al use case
      const repo = new FirebaseRestaurantRepository();
      const uc   = new UpdateRestaurant(repo);
      await uc.execute(uid!, data);

      // 4️⃣ Refresca el NavBar si cambió el nombre
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

  if (!restaurant) return null;

  return (
    <Container maxWidth="sm">
      <Box mt={5} display="flex" flexDirection="column" gap={2}>
        <Typography variant="h4" align="center">Edit Restaurant</Typography>
        {error    && <Alert severity="error">{error}</Alert>}
        {feedback && <Alert severity="success">{feedback}</Alert>}

        <TextField label="Name"        value={name}     onChange={e => setName(e.target.value)}        fullWidth />
        <TextField label="Email"       value={email}    onChange={e => setEmail(e.target.value)}      fullWidth />
        <TextField
          label="New Password"
          type="password"
          value={password}
          helperText="Leave blank to keep current password"
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
        <TextField label="Category"    value={category} onChange={e => setCategory(e.target.value)}   fullWidth />
        <TextField label="Image URL"   value={imageUrl} onChange={e => setImageUrl(e.target.value)} fullWidth />

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </Box>
    </Container>
  );
};
