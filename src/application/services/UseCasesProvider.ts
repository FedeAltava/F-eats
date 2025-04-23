import { MockGetRestaurantsService } from "./MockGetRestaurantsService";
import { GetRestaurantsUseCase } from "../../domain/usecases/GetRestaurantsUseCase";

class UseCasesProvider {
  static getRestaurantsUseCase(): GetRestaurantsUseCase {
    return new MockGetRestaurantsService();
  }
}

export default UseCasesProvider;
