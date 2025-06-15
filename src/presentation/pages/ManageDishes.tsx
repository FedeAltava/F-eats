
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import { FirebaseDishRepository } from "../../infrastructure/repositories/FirebaseDishRepository";
import { ListDishesByRestaurant } from "../../application/use-cases/dish/ListDishesByRestaurant";
import { DeleteDish } from "../../application/use-cases/dish/DeleteDish";
import { Dish } from "../../domain/entities/Dish";
import { orange } from "@mui/material/colors";

export const ManageDishes: React.FC = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);


  useEffect(() => {
    if (!restaurantId) return;

    (async () => {
      try {
        const repo = new FirebaseDishRepository();
        const uc = new ListDishesByRestaurant(repo);
        const list = await uc.execute(restaurantId);
        setDishes(list);
      } catch {
        setError("Error loading your dishes");
      } finally {
        setLoading(false);
      }
    })();
  }, [restaurantId]);


  const askDelete = (dishId: string) => {
    setDeletingId(dishId);
    setConfirmOpen(true);
  };


  const handleDelete = async () => {
    if (!deletingId) return;

    try {
      const repo = new FirebaseDishRepository();
      const uc = new DeleteDish(repo);
      await uc.execute(deletingId);


      setDishes((prev) => prev.filter((d) => d.id.value !== deletingId));
    } catch {
      setError("Failed to delete dish");
    } finally {
      setConfirmOpen(false);
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h3"
          align="center"
          gutterBottom
          sx={{
            color: orange[600],
            fontFamily: "Courier, monospace",

          }}>My Dishes</Typography>
        <Button
          variant="contained"
          onClick={() => navigate(`/restaurant/${restaurantId}/add-dish`)}
        >
          Add Dish
        </Button>
      </Box>

      <Grid container spacing={4}>
        {dishes.map((d) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.id.value}>
            <Box
              border={1}
              borderRadius={2}
              overflow="hidden"
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              {d.imageUrl?.value && (
                <Box
                  component="img"
                  src={d.imageUrl.value}
                  alt={d.name.value}
                  width="100%"
                  height={140}
                  sx={{ objectFit: "cover" }}
                />
              )}
              <Box p={2}>
                <Typography variant="h6">{d.name.value}</Typography>
                <Typography>${d.price.value.toFixed(2)}</Typography>
                {d.description?.value && (
                  <Typography variant="body2">{d.description.value}</Typography>
                )}
              </Box>
              <Box display="flex" justifyContent="flex-end" p={1}>
                <Button color="error" onClick={() => askDelete(d.id.value)}>
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this dish?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
