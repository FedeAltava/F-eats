
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { FirebaseOrderRepository } from "../../infrastructure/repositories/FirebaseOrderRepository";
import { ListOrdersByRestaurantUseCase } from "../../application/use-cases/order/ListOrdersByRestaurantUseCase";
import { Order } from "../../domain/entities/Order";
import { FirebaseUserRepository } from "../../infrastructure/repositories/FirebaseUserRepository";

interface OrderWithUserName {
  order: Order;
  userName: string;
}

export const RestaurantOrders: React.FC = () => {
  const navigate = useNavigate();
  const [ordersWithUser, setOrdersWithUser] = useState<OrderWithUserName[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      const role = localStorage.getItem("role");
      const restaurantId = localStorage.getItem("uid");
      if (role !== "restaurant" || !restaurantId) {
        navigate("/login-restaurant");
        return;
      }

      try {

        const orderRepo = new FirebaseOrderRepository();
        const listUC = new ListOrdersByRestaurantUseCase(orderRepo);
        const orders = await listUC.execute(restaurantId);


        const uniqueUserIds = Array.from(new Set(orders.map((o) => o.userId)));

        const userRepo = new FirebaseUserRepository();
        const userMap: Record<string, string> = {};

        await Promise.all(
          uniqueUserIds.map(async (uid) => {
            const user = await userRepo.findById(uid);
            userMap[uid] = user ? user.name.value : "Unknown";
          })
        );

        const combined: OrderWithUserName[] = orders.map((o) => ({
          order: o,
          userName: userMap[o.userId] || "Unknown",
        }));

        setOrdersWithUser(combined);
      } catch {
        setError("Error loading orders for this restaurant.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

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
        <Alert severity="error" sx={{ mt: 5 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (ordersWithUser.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography align="center">No orders received yet.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Orders Received
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Date</TableCell>
              <TableCell>User Name</TableCell>


              <TableCell align="right">Total ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersWithUser.map(({ order, userName }) => (
              <TableRow key={order.id.value}>

                <TableCell>{order.createdAt.toLocaleString()}</TableCell>
                <TableCell>{userName}</TableCell>
                <TableCell align="right">{order.total.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
