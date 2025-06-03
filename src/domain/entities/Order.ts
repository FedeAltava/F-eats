// src/domain/entities/Order.ts
import { Id } from "../value-objects/shared/Id";
import { ValueObject } from "../value-objects/shared/value-object";

// Value Object para los ítems de la orden
interface OrderItemProps {
  dishId: string;
  quantity: number;
  price: number; // precio unitario al momento de realizar la orden
}

export class OrderItem extends ValueObject<OrderItemProps> {
  get dishId(): string {
    return this.props.dishId;
  }
  get quantity(): number {
    return this.props.quantity;
  }
  get price(): number {
    return this.props.price;
  }

  public static create(props: OrderItemProps): OrderItem {
    if (!props.dishId) throw new Error("Dish ID is required");
    if (props.quantity <= 0) throw new Error("Quantity must be > 0");
    if (props.price < 0) throw new Error("Price must be >= 0");
    return new OrderItem(props);
  }

  // total por línea
  public get lineTotal(): number {
    return this.quantity * this.price;
  }
}

export interface OrderProps {
  id: Id;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  total: number;
  createdAt: Date;
}

export class Order {
  private readonly _id: Id;
  private readonly _userId: string;
  private readonly _restaurantId: string;
  private readonly _items: OrderItem[];
  private readonly _total: number;
  private readonly _createdAt: Date;

  public constructor(props: OrderProps) {
    this._id = props.id;
    this._userId = props.userId;
    this._restaurantId = props.restaurantId;
    this._items = props.items;
    this._total = props.total;
    this._createdAt = props.createdAt;
  }

  get id(): Id {
    return this._id;
  }
  get userId(): string {
    return this._userId;
  }
  get restaurantId(): string {
    return this._restaurantId;
  }
  get items(): OrderItem[] {
    return this._items;
  }
  get total(): number {
    return this._total;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  public static create(data: {
    userId: string;
    restaurantId: string;
    items: { dishId: string; quantity: number; price: number }[];
  }): Order {
    if (!data.userId) throw new Error("User ID is required");
    if (!data.restaurantId) throw new Error("Restaurant ID is required");
    if (!Array.isArray(data.items) || data.items.length === 0) {
      throw new Error("At least one item is required");
    }

    // convertir a OrderItem[]
    const itemsVO = data.items.map((i) =>
      OrderItem.create({ dishId: i.dishId, quantity: i.quantity, price: i.price })
    );

    const total = itemsVO.reduce((sum, i) => sum + i.lineTotal, 0);
    const id = Id.generate();
    const createdAt = new Date();

    return new Order({
      id,
      userId: data.userId,
      restaurantId: data.restaurantId,
      items: itemsVO,
      total,
      createdAt,
    });
  }

  // Representación para persistencia en Firestore
  public toPersistence(): unknown {
    return {
      userId: this.userId,
      restaurantId: this.restaurantId,
      items: this.items.map((i) => ({
        dishId: i.dishId,
        quantity: i.quantity,
        price: i.price,
      })),
      total: this.total,
      createdAt: this.createdAt.toISOString(),
    };
  }

  // ─── NUEVO MÉTODO PARA RECONSTRUIR DESDE DATOS DE FIRESTORE ───
  public static reconstruct(params: {
    id: string;
    userId: string;
    restaurantId: string;
    items: { dishId: string; quantity: number; price: number }[];
    total: number;
    createdAt: Date;
  }): Order {
    const itemsVO = params.items.map((i) =>
      OrderItem.create({ dishId: i.dishId, quantity: i.quantity, price: i.price })
    );
    return new Order({
      id: Id.create(params.id),
      userId: params.userId,
      restaurantId: params.restaurantId,
      items: itemsVO,
      total: params.total,
      createdAt: params.createdAt,
    });
  }
}
