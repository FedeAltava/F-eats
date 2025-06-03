// src/application/use-cases/order/CreateOrderUse-case.ts
import { Order } from "../../../domain/entities/Order";
import { OrderRepository } from "../..//repositories/OrderRepository";

export class CreateOrder {
  constructor(private orderRepo: OrderRepository) {}

  async execute(order: Order): Promise<void> {
    await this.orderRepo.create(order);
  }
}
