import { RestaurantRepository } from '../../repositories/RestaurantRepository';
import { RestaurantUpdateData } from '../../../domain/entities/Restaurant';
import { ErrorUpdatingRestaurant } from '../../../shared/errors/errors';

export class UpdateRestaurant {
  constructor(private restaurantRepository: RestaurantRepository) {}

  async execute(id: string, data: RestaurantUpdateData): Promise<void> {
    try {
      const restaurant = await this.restaurantRepository.getById(id);

      if (!restaurant) {
        throw new ErrorUpdatingRestaurant();
      }

      const updated = restaurant.update(data);
      await this.restaurantRepository.save(updated);

    } catch (error) {
      if (error instanceof ErrorUpdatingRestaurant) throw error;
      throw new ErrorUpdatingRestaurant();
    }
  }
}
