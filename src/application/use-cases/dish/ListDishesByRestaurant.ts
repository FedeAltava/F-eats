import { Dish } from "../../../domain/entities/Dish";
import { DishRepository } from "../../repositories/DishRepository";
import { ErrorListingDishes } from "../../../shared/errors/errors";

export class ListDishesByRestaurant {
  constructor(private dishRepository: DishRepository) {}

  async execute(restaurantId: string): Promise<Dish[]> {
    try {
      return await this.dishRepository.listByRestaurant(restaurantId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ErrorListingDishes();
    }
  }
}
