// src/presentation/pages/RestaurantDetails.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";

import { FirebaseDishRepository } from "../../infrastructure/repositories/FirebaseDishRepository";
import { ListDishesByRestaurant } from "../../application/use-cases/dish/ListDishesByRestaurant";
import { Dish } from "../../domain/entities/Dish";
import { useCartStore } from "../store/useCartStore";

export const RestaurantDetails: React.FC = () => {
  const { id: restaurantId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [snackOpen, setSnackOpen] = useState(false);
  const addDish = useCartStore((state) => state.addDish);

  const handleSnackClose = (
    _: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackOpen(false);
  };

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

  const role = localStorage.getItem("role");

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom align="center">
          Menu
        </Typography>

        <Grid container spacing={4} alignItems="stretch">
          {dishes.map((d) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={d.id.value}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                  height: "100%",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 6,
                  },
                }}
              >
                {/* Imagen del plato */}
                {d.imageUrl?.value && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={d.imageUrl.value}
                    alt={d.name.value}
                  />
                )}

                {/* Contenido principal: título, descripción y precio */}
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* flexGrow: 1 hace que este bloque ocupe todo el espacio sobrante */}
                  <Typography variant="h6" gutterBottom>
                    {d.name.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {/* Si la descripción es corta o larga, el cuerpo siempre crece igual */}
                    {d.description?.value || "No description available."}
                  </Typography>
                  <Typography variant="subtitle1">
                    ${d.price.value.toFixed(2)}
                  </Typography>
                </CardContent>

                {/* Botón “Add to Cart”, siempre abajo de la tarjeta */}
                <CardActions>
                  <Button
                    size="small"
                    onClick={() => {
                      if (role !== "user") {
                        navigate("/login");
                      } else {
                        addDish(d);
                        setSnackOpen(true);
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Snackbar para “Product added” */}
      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Product added to cart!
        </Alert>
      </Snackbar>
    </>
  );
};
