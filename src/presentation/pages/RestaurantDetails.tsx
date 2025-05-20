// src/presentation/pages/RestaurantDetails.tsx
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { FirebaseDishRepository } from "../../infrastructure/repositories/FirebaseDishRepository";
import { ListDishesByRestaurant } from "../../application/use-cases/dish/ListDishesByRestaurant";
import { Dish } from "../../domain/entities/Dish";
import { useCartStore } from "../store/useCartStore";

export const RestaurantDetails = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const addDish = useCartStore(state => state.addDish); 
  
  useEffect(() => {
    if (!restaurantId) return;
    const loadMenu = async () => {
      try {
        const repo = new FirebaseDishRepository();
        const useCase = new ListDishesByRestaurant(repo);
        const list = await useCase.execute(restaurantId);
        setDishes(list);
      } catch {
        setError("Error loading menu");
      } finally {
        setLoading(false);
      }
    };
    loadMenu();
  }, [restaurantId]);

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
        <Typography color="error" align="center" mt={5}>
          ❌ {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Menu
      </Typography>

      <Grid container spacing={4}>
        {dishes.map((d) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.id.value}>
            <Card
              sx={{
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": { transform: "scale(1.03)", boxShadow: 6 },
              }}
            >
              {d.imageUrl?.value && (
                <CardMedia
                  component="img"
                  height="140"
                  image={d.imageUrl.value}
                  alt={d.name.value}
                />
              )}
              <CardContent>
                <Typography variant="h6">{d.name.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${d.price.value.toFixed(2)}
                </Typography>
                {d.description?.value && (
                  <Typography variant="body2">
                    {d.description.value}
                  </Typography>
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => addDish(d)} 
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
