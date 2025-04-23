import { useEffect, useState } from "react";
import UseCasesProvider from "../../application/services/UseCasesProvider";
import { Restaurant } from "../../domain/entities/Restaurant";

const HomePage = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const service = UseCasesProvider.getRestaurantsUseCase();
      const data = await service.execute();
      setRestaurants(data);
    };

    fetchRestaurants();
  }, []);

  return (
    <div>
      <h1>Restaurantes disponibles</h1>
      <pre>{JSON.stringify(restaurants, null, 2)}</pre>
    </div>
  );
};

export default HomePage;
