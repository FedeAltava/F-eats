
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useCartStore } from "../store/useCartStore";

import { FirebaseOrderRepository } from "../../infrastructure/repositories/FirebaseOrderRepository";
import { CreateOrder } from "../../application/use-cases/order/CreateOrderUse-case";
import { Order } from "../../domain/entities/Order";
import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [restaurantName, setRestaurantName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
      return;
    }


    const restaurantId = items[0]?.dish.restaurantId.value || "";
    if (restaurantId) {
      const loadName = async () => {
        try {
          const repoR = new FirebaseRestaurantRepository();
          const rest = await repoR.getById(restaurantId);
          setRestaurantName(rest ? rest.name.value : "Unknown Restaurant");
        } catch {
          setRestaurantName("Unknown Restaurant");
        }
      };
      loadName();
    }
  }, [items, navigate]);


  const total = items.reduce(
    (sum, i) => sum + i.dish.price.value * i.quantity,
    0
  );
  const restaurantId = items[0]?.dish.restaurantId.value || "";

  const handleConfirm = async () => {
    setError(null);


    if (!restaurantId) {
      setError("Could not determine restaurant. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem("uid");
      if (!userId) {
        throw new Error("User not authenticated");
      }


      const order = Order.create({
        userId,
        restaurantId,
        items: items.map((i) => ({
          dishId: i.dish.id.value,
          quantity: i.quantity,
          price: i.dish.price.value,
        })),
      });


      const repo = new FirebaseOrderRepository();
      const uc = new CreateOrder(repo);
      await uc.execute(order);


      clearCart();
      setSuccess(true);

      setTimeout(() => navigate("/"), 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center">
        Checkout {restaurantName && `– ${restaurantName}`}
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Your order has been placed! Redirecting to Home…
        </Alert>
      )}

      <List sx={{ mt: 2 }}>
        {items.map((i) => (
          <ListItem key={i.dish.id.value} disablePadding>
            <ListItemText
              primary={`${i.dish.name.value} x${i.quantity}`}
              secondary={`$${(i.dish.price.value * i.quantity).toFixed(2)}`}
            />
          </ListItem>
        ))}
      </List>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">${total.toFixed(2)}</Typography>
      </Box>

      <Box mt={3}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleConfirm}
          disabled={loading || success}
        >
          {loading ? "Placing Order…" : success ? "Order Placed!" : "Confirm Order"}
        </Button>
      </Box>
    </Container>
  );
};
