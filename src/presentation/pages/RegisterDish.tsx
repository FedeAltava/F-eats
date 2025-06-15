import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { FirebaseDishRepository } from "../../infrastructure/repositories/FirebaseDishRepository";
import { CreateDish } from "../../application/use-cases/dish/CreateDish";
import { Dish } from "../../domain/entities/Dish";
import { orange } from "@mui/material/colors";

export const RegisterDish = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!restaurantId) {
      setError("Invalid restaurant");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const dish = Dish.create({
        name,
        price,
        description,
        imageUrl,
        restaurantId,
      });
      const repo = new FirebaseDishRepository();
      const uc = new CreateDish(repo);
      await uc.execute(dish);
      setSuccess(true);
      setName("");
      setPrice(0);
      setDescription("");
      setImageUrl("");
      navigate(`/restaurant/${restaurantId}/manage-dishes`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError("Failed to create dish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} display="flex" flexDirection="column" gap={2}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: orange[600],
            fontFamily: "Courier, monospace",
          }}
        >
          Add New Dish
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Dish added successfully</Alert>}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={price}
          onChange={(e) => setPrice(+e.target.value)}
          fullWidth
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={handleCreate} disabled={loading}>
          {loading ? "Adding…" : "Add Dish"}
        </Button>
      </Box>
    </Container>
  );
};
