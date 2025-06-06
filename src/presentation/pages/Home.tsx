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
} from "@mui/material";

import Grid from "@mui/material/Grid";

import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";
import { ListRestaurantsUseCase } from "../../application/use-cases/restaurant/ListRestaurantsUseCase";
import { Restaurant } from "../../domain/entities/Restaurant";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const uid = localStorage.getItem("uid");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (role === "restaurant" && uid) {
      navigate(`/profile-restaurant`);
      return;
    }

    const load = async () => {
      try {
        const repo = new FirebaseRestaurantRepository();
        const useCase = new ListRestaurantsUseCase(repo);
        const list = await useCase.execute();
        setRestaurants(list);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setError("Error listing restaurants");
      } finally {
        setLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
<Typography
  variant="h5"
  component="h1"
  align="center"
  sx={{
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1,
    mb: 2,
    color: "text.primary",
  }}
>
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
