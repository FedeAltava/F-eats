import { DishRepository } from "../../repositories/DishRepository";
import { ErrorListingDishes } from "../../../shared/errors/errors";
import { Dish } from "../../../domain/entities/Dish";

export class ListDishes {
  constructor(private dishRepository: DishRepository) {}

  async execute(): Promise<Dish[]> {
    try {
      return await this.dishRepository.list();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ErrorListingDishes();
    }
  }
}

