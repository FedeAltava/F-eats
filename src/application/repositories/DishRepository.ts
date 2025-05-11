import { Dish } from "../../domain/entities/Dish";
import { Id } from "../../domain/value-objects/shared/Id";

export interface DishRepository {
  create(dish: Dish): Promise<void>;
  update(dish: Dish): Promise<void>;
  delete(id: Id): Promise<void>;
  findById(id: string): Promise<Dish | null>;
  listByRestaurant(restaurantId: string): Promise<Dish[]>;
  list(): Promise<Dish[]>;
}
