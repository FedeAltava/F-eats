// src/infrastructure/repositories/FirebaseOrderRepository.ts
import { OrderRepository } from "../../application/repositories/OrderRepository";
import { Order, OrderItem } from "../../domain/entities/Order";
import { db } from "../firebase/fireBaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from "firebase/firestore";

const COLLECTION_NAME = "orders";

export class FirebaseOrderRepository implements OrderRepository {
  async create(order: Order): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, order.id.value);
    await setDoc(ref, order.toPersistence());
  }

  async listByUser(userId: string): Promise<Order[]> {
    const ordersRef = collection(db, COLLECTION_NAME);
    const q = query(ordersRef, where("userId", "==", userId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = (data.items as any[]).map((i) =>
        OrderItem.create({
          dishId: i.dishId,
          quantity: i.quantity,
          price: i.price,
        })
      );

      return Order.reconstruct({
        id: docSnap.id,
        userId: data.userId,
        restaurantId: data.restaurantId,
        items: items.map((vo) => ({
          dishId: vo.dishId,
          quantity: vo.quantity,
          price: vo.price,
        })),
        total: data.total,
        createdAt: Timestamp.fromDate(new Date(data.createdAt)).toDate(),
      });
    });
  }

  // ─── Nuevo método para listar por restaurantId ───
  async listByRestaurant(restaurantId: string): Promise<Order[]> {
    const ordersRef = collection(db, COLLECTION_NAME);
    const q = query(ordersRef, where("restaurantId", "==", restaurantId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = (data.items as any[]).map((i) =>
        OrderItem.create({
          dishId: i.dishId,
          quantity: i.quantity,
          price: i.price,
        })
      );

      return Order.reconstruct({
        id: docSnap.id,
        userId: data.userId,
        restaurantId: data.restaurantId,
        items: items.map((vo) => ({
          dishId: vo.dishId,
          quantity: vo.quantity,
          price: vo.price,
        })),
        total: data.total,
        createdAt: Timestamp.fromDate(new Date(data.createdAt)).toDate(),
      });
    });
  }
}
