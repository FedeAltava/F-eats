import { DishRepository } from "../../application/repositories/DishRepository";
import { Dish } from "../../domain/entities/Dish";
import { Id } from "../../domain/value-objects/shared/Id";
import { db } from "../firebase/fireBaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "dishes";

export class FirebaseDishRepository implements DishRepository {
  async create(dish: Dish): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, dish.id.value);
    await setDoc(ref, dish.toPersistence());
  }

  async update(dish: Dish): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, dish.id.value);
    await setDoc(ref, dish.toPersistence(), { merge: true });
  }

  async delete(id: Id): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, id.value);
    await deleteDoc(ref);
  }

  async findById(id: string): Promise<Dish | null> {
    const ref = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;

    const data = snapshot.data();
    return Dish.create({
      id: snapshot.id,
      name: data.name,
      price: data.price,
      description: data.description,
      imageUrl: data.imageUrl,
      restaurantId: data.restaurantId,
    });
  }

  async list(): Promise<Dish[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return Dish.create({
        id: docSnap.id,
        name: data.name,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        restaurantId: data.restaurantId,
      });
    });
  }

  async listByRestaurant(restaurantId: string): Promise<Dish[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("restaurantId", "==", restaurantId)
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return Dish.create({
        id: docSnap.id,
        name: data.name,
        price: data.price,
        description: data.description,
        imageUrl: data.imageUrl,
        restaurantId: data.restaurantId,
      });
    });
  }
}
