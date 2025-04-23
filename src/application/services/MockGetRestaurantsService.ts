import { GetRestaurantsUseCase } from "../../domain/usecases/GetRestaurantsUseCase";
import { Restaurant } from "../../domain/entities/Restaurant";

export class MockGetRestaurantsService implements GetRestaurantsUseCase {
  async execute(): Promise<Restaurant[]> {
    return [
      {
        id: "1",
        name: "Pizzería La Toscana",
        category: "Italiana",
        rating: 4.6,
        imageUrl: "https://via.placeholder.com/300x200",
        deliveryTime: "30-40 min"
      },
      {
        id: "2",
        name: "Sushi Master",
        category: "Japonesa",
        rating: 4.8,
        imageUrl: "https://via.placeholder.com/300x200",
        deliveryTime: "25-35 min"
      }
    ];
  }
}
