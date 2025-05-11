import { Id } from "../value-objects/shared/Id";
import { DishName } from "../value-objects/DishName";
import { Price } from "../value-objects/Price";
import { Description } from "../value-objects/Description";
import { ImageUrl } from "../value-objects/ImageUrl";
import { Entity } from "./shared/Entity";

export interface DishObjectData {
  id: Id;
  name: DishName;
  price: Price;
  description?: Description;
  imageUrl?: ImageUrl;
  restaurantId: Id;
}

export interface DishData {
  id?: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  restaurantId: string;
}

export interface DishUpdateData {
  name?: string;
  price?: number;
  description?: string;
  imageUrl?: string;
}

export class Dish extends Entity {
  public readonly name: DishName;
  public readonly price: Price;
  public readonly description?: Description;
  public readonly imageUrl?: ImageUrl;
  public readonly restaurantId: Id;

  private constructor(data: DishObjectData) {
    super(data.id);
    this.name = data.name;
    this.price = data.price;
    this.description = data.description;
    this.imageUrl = data.imageUrl;
    this.restaurantId = data.restaurantId;
  }

  public static create(data: DishData): Dish {
    const id = data.id ? Id.create(data.id) : Id.generate();
    const name = DishName.create(data.name);
    const price = Price.create(data.price);
    const description = data.description ? Description.create(data.description) : undefined;
    const imageUrl = data.imageUrl ? ImageUrl.create(data.imageUrl) : undefined;
    const restaurantId = Id.create(data.restaurantId);

    return new Dish({ id, name, price, description, imageUrl, restaurantId });
  }

  public update(data: DishUpdateData): Dish {
    const name = data.name ? DishName.create(data.name) : this.name;
    const price = data.price ? Price.create(data.price) : this.price;
    const description = data.description ? Description.create(data.description) : this.description;
    const imageUrl = data.imageUrl ? ImageUrl.create(data.imageUrl) : this.imageUrl;

    return new Dish({
      id: this.id,
      name,
      price,
      description,
      imageUrl,
      restaurantId: this.restaurantId,
    });
  }

  public toJSON() {
    return {
      id: this.id.value,
      name: this.name.value,
      price: this.price.value,
      description: this.description?.value,
      imageUrl: this.imageUrl?.value,
      restaurantId: this.restaurantId.value,
    };
  }

  public toPersistence() {
    return {
      id: this.id.value,
      name: this.name.value,
      price: this.price.value,
      description: this.description?.value,
      imageUrl: this.imageUrl?.value,
      restaurantId: this.restaurantId.value,
    };
  }
}
