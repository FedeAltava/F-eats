// src/domain/repositories/OrderRepository.ts
import { Order } from "../../domain/entities/Order";

export interface OrderRepository {
  create(order: Order): Promise<void>;
  listByUser(userId: string): Promise<Order[]>;

}
