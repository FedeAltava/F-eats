// src/presentation/pages/Cart.tsx
import { useState } from "react";
import { Container, Typography, Button, Box, List, ListItem, ListItemText, Divider } from "@mui/material";
import { useCartStore } from "../store/useCartStore";

export const Cart = () => {
  const items = useCartStore(state => state.items);
  const removeDish = useCartStore(state => state.removeDish);
  const clearCart = useCartStore(state => state.clearCart);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = items.reduce((sum, i) => sum + i.dish.price.value * i.quantity, 0);

  const handleCheckout = () => {
    // aquí podrías llamar a un caso de uso CreateOrder
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h5" align="center">Thank you! Your order has been placed.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom>Cart</Typography>
      {items.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        <>
          <List>
            {items.map(i => (
              <Box key={i.dish.id.value}>
                <ListItem
                  secondaryAction={
                    <Button color="error" onClick={() => removeDish(i.dish.id.value)}>
                      Remove
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`${i.dish.name.value} x${i.quantity}`}
                    secondary={`$${(i.dish.price.value * i.quantity).toFixed(2)}`}
                  />
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6">${total.toFixed(2)}</Typography>
          </Box>
          <Box mt={3}>
            <Button variant="contained" fullWidth onClick={handleCheckout}>
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};
