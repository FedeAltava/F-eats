// src/infrastructure/repositories/firebase/FirebaseOrderRepository.ts
import { OrderRepository } from "../../application/repositories/OrderRepository";
import { Order, OrderItem } from "../../domain/entities/Order";
import { Id } from "../../domain/value-objects/shared/Id";
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
      // Reconstruir Array de OrderItem
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = (data.items as any[]).map((i) =>
        OrderItem.create({
          dishId: i.dishId,
          quantity: i.quantity,
          price: i.price,
        })
      );

      // Mantener id y createdAt original en lugar de generar uno nuevo
      return new Order({
        id: Id.create(docSnap.id),
        userId: data.userId,
        restaurantId: data.restaurantId,
        items,
        total: data.total,
        createdAt: Timestamp.fromDate(new Date(data.createdAt)).toDate(),
      });
    });
  }
}
