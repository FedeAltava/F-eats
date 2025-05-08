import { RestaurantRepository } from '../../repositories/RestaurantRepository';
import { Restaurant } from '../../../domain/entities/Restaurant';
import { ErrorCreatingRestaurant, RestaurantAlreadyExistsError } from '../../../shared/errors/errors';


export class CreateRestaurant {
    constructor(private restaurantRepository: RestaurantRepository){}
    
    async execute(restaurant:Restaurant):Promise<void>{

        try{
            const restaurantExists = await this.restaurantRepository.getByEmail(restaurant.email.value);// might change for getByName
            if(restaurantExists){
                throw new RestaurantAlreadyExistsError();
            }

            await this.restaurantRepository.save(restaurant);

        }catch(error){;
            if( error instanceof RestaurantAlreadyExistsError){
                throw error;
            }
            throw new ErrorCreatingRestaurant();
        }
    }
}