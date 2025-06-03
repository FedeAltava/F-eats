// src/presentation/pages/Checkout.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container, Typography, List, ListItem,
  ListItemText, Box, Button, Alert
} from "@mui/material";
import { useCartStore } from "../store/useCartStore";
import { FirebaseOrderRepository } from "../../infrastructure/repositories/FirebaseOrderRepository";
import { CreateOrder } from "../../application/use-cases/order/CreateOrderUse-case";
import { Order } from "../../domain/entities/Order";

export const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore(state => state.items);
  const clearCart = useCartStore(state => state.clearCart);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Si el carrito está vacío, redirigir a Home
  React.useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

  // Calcular total
  const total = items.reduce((sum, i) => sum + i.dish.price.value * i.quantity, 0);
  // Suponemos que todos los platos son del mismo restaurante
  const restaurantId = items[0]?.dish.restaurantId.value || "";

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);

    try {
      const userId = localStorage.getItem("uid");
      if (!userId) throw new Error("User not authenticated");

      // Construir la orden
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
      // Redirigir tras 1.5s a Home
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
      <Typography variant="h4" gutterBottom align="center">
        Checkout
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">Order placed successfully!</Alert>}

      <List>
        {items.map((i) => (
          <ListItem key={i.dish.id.value}>
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
          disabled={loading}
        >
          {loading ? "Placing Order…" : "Confirm Order"}
        </Button>
      </Box>
    </Container>
  );
};
