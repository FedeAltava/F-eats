import { DishRepository } from "../../repositories/DishRepository";
import { DishUpdateData } from "../../../domain/entities/Dish";
import { ErrorUpdatingDish, DishNotFoundError } from "../../../shared/errors/errors";

export class UpdateDish {
  constructor(private dishRepository: DishRepository) {}

  async execute(id: string, data: DishUpdateData): Promise<void> {
    try {
      const dish = await this.dishRepository.findById(id);
      if (!dish) throw new DishNotFoundError();

      const updated = dish.update(data);
      await this.dishRepository.update(updated);
    } catch (error) {
      if (error instanceof DishNotFoundError) throw error;
      throw new ErrorUpdatingDish();
    }
  }
}
