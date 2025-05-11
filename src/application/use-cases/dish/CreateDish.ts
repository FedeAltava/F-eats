import { Dish } from "../../../domain/entities/Dish";
import { DishRepository } from "../../repositories/DishRepository";
import { ErrorCreatingDish } from "../../../shared/errors/errors";

export class CreateDish {
  constructor(private dishRepository: DishRepository) {}

  async execute(dish: Dish): Promise<void> {
    try {
      await this.dishRepository.create(dish);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ErrorCreatingDish();
    }
  }
}
