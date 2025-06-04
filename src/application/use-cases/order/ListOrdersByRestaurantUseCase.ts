// src/application/use-cases/order/ListOrdersByRestaurantUseCase.ts
import { Order } from "../../../domain/entities/Order";
import { OrderRepository } from "../..//repositories/OrderRepository";

export class ListOrdersByRestaurantUseCase {
  constructor(private orderRepo: OrderRepository) {}

  async execute(restaurantId: string): Promise<Order[]> {
    return await this.orderRepo.listByRestaurant(restaurantId);
  }
}
