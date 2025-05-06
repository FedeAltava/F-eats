import { Restaurant } from '../../domain/entities/Restaurant';
import { ErrorDeletingResturant } from '../../shared/errors/errors';
import { RestaurantRepository } from '../repositories/RestaurantRepository';


export class  DeleteRestaurant{
    constructor(private restaurantRepository:RestaurantRepository) {};

    async execute(restaurant:Restaurant): Promise<void>{
        try{
            const restaurantExists = await this.restaurantRepository.getById(restaurant.id.value);
            if (!restaurantExists) {
                throw new ErrorDeletingResturant();
            }
            await this.restaurantRepository.delete(restaurant.id)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        }catch(error){
            throw new ErrorDeletingResturant;
        }
    }
}