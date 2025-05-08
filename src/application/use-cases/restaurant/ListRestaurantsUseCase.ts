import { Restaurant } from '../../../domain/entities/Restaurant';
import { ErrorListingRestaurants } from '../../../shared/errors/errors';
import { RestaurantRepository } from '../../repositories/RestaurantRepository';


export class ListRestaurantsUseCase {
    constructor(private restaurantRepository: RestaurantRepository) {}

    async execute(): Promise<Restaurant[]> {
        try {
            return await this.restaurantRepository.list();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            throw new ErrorListingRestaurants();
        }
    }
}