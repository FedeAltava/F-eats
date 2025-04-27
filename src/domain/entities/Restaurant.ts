import { Email } from "../value-objects/Email";
import { Name } from "../value-objects/Name";
import { Password } from "../value-objects/Password";
import { Id } from "../value-objects/shared/Id";
import { Entity } from "./shared/Entity";
import { Category } from '../value-objects/Category';
import { Rating } from "../value-objects/Rating";
import { ImageUrl } from '../value-objects/ImageUrl';

interface RestaurantObjectData {
  id: Id;
  name: Name;
  email: Email;
  password: Password;
  category: Category;
  rating: Rating;
  imageUrl: ImageUrl;
  menu: [];
}

interface RestaurantData {
  id?: string;
  name: string;
  email: string;
  password: string;
  category: string;
  rating: number;
  imageUrl: string;
  menu: [];
}

export interface RestaurantUpdateData {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  category?: string;
  rating?: number;
  imageUrl?: string;
}

export class Restaurant extends Entity {
    public readonly name: Name;
    public readonly email: Email;
    public readonly password: Password;
    public readonly category: Category;
    public readonly rating: Rating;
    public readonly imageUrl: ImageUrl;
    public readonly menu: [];


    private constructor (data: RestaurantObjectData) {
      super(data.id);
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.category = data.category;
      this.rating = data.rating;
      this.imageUrl = data.imageUrl;
      this.menu = data.menu; 
    }

    public static create (data:RestaurantData): Restaurant {
      const id = !data.id ? Id.generate() : Id.create(data.id);
      const name = Name.create(data.name);
      const email = Email.create(data.email);
      const password = Password.create(data.password);
      const category = Category.create(data.category);
      const rating = Rating.create(data.rating);
      const imageUrl = ImageUrl.create(data.imageUrl);
      return new Restaurant({ id, name, email, password, category, rating, imageUrl, menu:[] })
    }

    public update(data: RestaurantUpdateData): Restaurant {
      const name = data.name ? Name.create(data.name) : this.name;
      const email = data.email ? Email.create(data.email) : this.email;
      const password = data.password ? Password.create(data.password) : this.password;
      const category = data.category ? Category.create(data.category) : this.category;
      const rating = data.rating ? Rating.create(data.rating) : this.rating;
      const imageUrl = data.imageUrl ? ImageUrl.create(data.imageUrl) : this.imageUrl;
    
      return new Restaurant({ 
        id: this.id, 
        name, 
        email, 
        password, 
        category, 
        rating, 
        imageUrl, 
        menu: this.menu   // Conservamos el menú actual
      });
    }

    public toJSON() {
      return {
        id: this.id.value,
        name: this.name.value,
        email: this.email.value,
        category: this.category.value,
        rating: this.rating.value,
        imageUrl: this.imageUrl.value
        // No incluye menú por ahora
      };
    }

    public toPersistence() {
      return {
        id: this.id.value,
        name: this.name.value,
        email: this.email.value,
        password: this.password.value,
        category: this.category.value,
        rating: this.rating.value,
        imageUrl: this.imageUrl.value
        // No incluye menú por ahora
      }
  }
}
