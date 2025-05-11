import { DishRepository } from "../../repositories/DishRepository";
import { ErrorDeletingDish, DishNotFoundError } from "../../../shared/errors/errors";

export class DeleteDish {
  constructor(private dishRepository: DishRepository) {}

  async execute(id: string): Promise<void> {
    try {
      const dish = await this.dishRepository.findById(id);
      if (!dish) throw new DishNotFoundError();

      await this.dishRepository.delete(dish.id);
    } catch (error) {
      if (error instanceof DishNotFoundError) throw error;
      throw new ErrorDeletingDish();
    }
  }
}
