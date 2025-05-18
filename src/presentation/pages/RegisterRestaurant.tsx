import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";
import { CreateRestaurant } from "../../application/use-cases/restaurant/CreateRestaurantUse-case";
import { Restaurant } from "../../domain/entities/Restaurant";
import { useNavigate } from "react-router-dom";

export const RegisterRestaurant = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleRegister = async () => {
    try {
      const restaurant = Restaurant.create({
        name,
        email,
        password,
        category,
        rating,
        imageUrl,
        menu: [], // por ahora vacío
      });

      const repository = new FirebaseRestaurantRepository();
      const useCase = new CreateRestaurant(repository);
      await useCase.execute(restaurant);

      setFeedback("✅ Restaurant registered successfully.");
      setName("");
      setEmail("");
      setPassword("");
      setCategory("");
      setRating(0);
      setImageUrl("");
      navigate("/login-restaurant");
    } catch (error: unknown) {
      setFeedback(`❌ ${error}`);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" gap={2} mt={5}>
        <Typography variant="h4" align="center">Register Restaurant</Typography>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <TextField label="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <TextField label="Rating" type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
        <TextField label="Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <Button variant="contained" onClick={handleRegister}>Register</Button>
        {feedback && <Typography align="center">{feedback}</Typography>}
      </Box>
    </Container>
  );
};
