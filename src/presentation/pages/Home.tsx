// src/presentation/pages/Home.tsx
import { useState, useEffect } from "react";
import bannerFeats from "../../assets/bannerFeats.png";
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
import { orange } from "@mui/material/colors";
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
  const title = "Restaurants";
  const len = title.length;

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      <Box
        mb={5}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 1000,
          height: 200,
          mx: "auto",
          borderRadius: 2,
          overflow: "hidden",
          display: "block",
          "@media (max-width:674px)": {
            display: "none",
          },
        }}
      >
        <Box
          component="img"
          src={bannerFeats}
          alt="F-eats portada"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "top",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            fontSize: "6rem",
            fontWeight: "bold",
            textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
          }}
        >
          Feats
        </Box>
      </Box>

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
