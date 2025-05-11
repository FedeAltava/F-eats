import { Restaurant } from '../../domain/entities/Restaurant';
import { Id } from '../../domain/value-objects/shared/Id';

export interface RestaurantRepository {
      create(restaurant: Restaurant): Promise<void>;
      update(restaurant: Restaurant): Promise<void>;
    delete(id: Id): Promise<void>;
    list(): Promise<Restaurant[]>;
    getByName(name: string): Promise<Restaurant[]>;
    getByEmail(email: string): Promise <Restaurant>;
    getById(id: string): Promise <Restaurant>;
    getByCategory(category: string): Promise<Restaurant[]>;
}
