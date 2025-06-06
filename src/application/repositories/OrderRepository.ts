
import { Order } from "../../domain/entities/Order";

export interface OrderRepository {
  create(order: Order): Promise<void>;
  listByUser(userId: string): Promise<Order[]>;
  listByRestaurant(restaurantId: string): Promise<Order[]>;
}
