// src/presentation/pages/MyOrders.tsx
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
import { ListOrdersByUserUseCase } from "../../application/use-cases/order/ListOrdersByUserUse-case";

import { Order} from "../../domain/entities/Order";
import { FirebaseRestaurantRepository } from "../../infrastructure/repositories/FirebaseRestaurantRepository";

interface OrderWithRestaurantName {
  order: Order;
  restaurantName: string;
}

export const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [ordersWithName, setOrdersWithName] = useState<
    OrderWithRestaurantName[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    (async () => {
      const userId = localStorage.getItem("uid");
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        // 1️⃣ Obtener la lista de órdenes del usuario
        const orderRepo = new FirebaseOrderRepository();
        const listUC = new ListOrdersByUserUseCase(orderRepo);
        const orders = await listUC.execute(userId);

        // 2️⃣ Extraer todos los restaurantId únicos
        const uniqueIds = Array.from(
          new Set(orders.map((o) => o.restaurantId))
        );

        // 3️⃣ Para cada restaurantId, hacemos getById para obtener su nombre
        const restaurantRepo = new FirebaseRestaurantRepository();
        const nameMap: Record<string, string> = {};
        await Promise.all(
          uniqueIds.map(async (rid) => {
            const rest = await restaurantRepo.getById(rid);
            nameMap[rid] = rest ? rest.name.value : "Unknown";
          })
        );

        // 4️⃣ Crear array con la orden y su nombre de restaurante
        const combined: OrderWithRestaurantName[] = orders.map((o) => ({
          order: o,
          restaurantName: nameMap[o.restaurantId] || "Unknown",
        }));

        setOrdersWithName(combined);
      } catch {
        setError("Error loading your orders");
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

  if (ordersWithName.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography align="center">You have no orders yet.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        My Orders
      </Typography>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              {/* Ya no mostramos “Order ID” */}
              <TableCell>Order Date</TableCell>
              <TableCell>Restaurant Name</TableCell>
              <TableCell align="right">Total ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ordersWithName.map(({ order, restaurantName }) => (
              <React.Fragment key={order.id.value}>
                {/* Fila resumen de orden */}
                <TableRow>
                  <TableCell>
                    {order.createdAt.toLocaleString()}
                  </TableCell>
                  <TableCell>{restaurantName}</TableCell>
                  <TableCell align="right">
                    {order.total.toFixed(2)}
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
