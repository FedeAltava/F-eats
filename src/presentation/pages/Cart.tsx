import {
  Container,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { useCartStore } from "../store/useCartStore";
import { useNavigate } from "react-router-dom";
import { orange } from "@mui/material/colors";
export const Cart = () => {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const removeDish = useCartStore((state) => state.removeDish);

  const total = items.reduce(
    (sum, i) => sum + i.dish.price.value * i.quantity,
    0
  );

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          color: orange[600],
          fontFamily: "Courier, monospace",
        }}
      >
        Cart
      </Typography>

      {items.length === 0 ? (
        <Typography>No items in cart.</Typography>
      ) : (
        <>
          <List>
            {items.map((i) => (
              <Box key={i.dish.id.value}>
                <ListItem
                  secondaryAction={
                    <Button
                      color="error"
                      onClick={() => removeDish(i.dish.id.value)}
                    >
                      Remove
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`${i.dish.name.value} x${i.quantity}`}
                    secondary={`$${(i.dish.price.value * i.quantity).toFixed(
                      2
                    )}`}
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
            <Button
              variant="contained"
              fullWidth
              disabled={items.length === 0}
              onClick={() => navigate("/checkout")}
            >
              Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};
