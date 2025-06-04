// src/application/use-cases/order/ListOrdersByUserUse-case.ts
import { Order } from "../../../domain/entities/Order";
import { OrderRepository } from "../../repositories/OrderRepository";

export class ListOrdersByUserUseCase {
  constructor(private orderRepo: OrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    return await this.orderRepo.listByUser(userId);
  }
}
