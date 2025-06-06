// src/presentation/pages/Home.tsx
import { useState, useEffect } from "react";
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
  CardActionArea,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Link } from "react-router-dom";

import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";
import { ListRestaurantsUseCase } from "../../application/use-cases/restaurant/ListRestaurantsUseCase";
import { Restaurant } from "../../domain/entities/Restaurant";

export const Home = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const repo = new FirebaseRestaurantRepository();
        const useCase = new ListRestaurantsUseCase(repo);
        const list = await useCase.execute();
        setRestaurants(list);
      } catch {
        setError("Error listing restaurants");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        Restaurants
      </Typography>

      <Grid container spacing={4}>
        {restaurants.map((r) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={r.id.value}>
            <Card
              sx={{
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
              }}
            >
              <CardActionArea component={Link} to={`/restaurant/${r.id.value}`}>
                {r.imageUrl.value && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={r.imageUrl.value}
                    alt={r.name.value}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{r.name.value}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {r.category.value}
                  </Typography>

                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/restaurant/${r.id.value}`}
                >
                  View Menu
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
