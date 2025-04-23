import { Restaurant } from "../entities/Restaurant";

export interface GetRestaurantsUseCase {
  execute(): Promise<Restaurant[]>;
}
