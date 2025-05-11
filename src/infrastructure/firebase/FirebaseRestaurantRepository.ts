import { RestaurantRepository } from "../../application/repositories/RestaurantRepository";
import { Restaurant } from "../../domain/entities/Restaurant";
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

const COLLECTION_NAME = "restaurants";

export class FirebaseRestaurantRepository implements RestaurantRepository {
  async create(restaurant: Restaurant): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, restaurant.id.value);
    await setDoc(ref, restaurant.toPersistence());
  }

  async update(restaurant: Restaurant): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, restaurant.id.value);
    await setDoc(ref, restaurant.toPersistence(), { merge: true });
  }

  async delete(id: Id): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, id.value);
    await deleteDoc(ref);
  }

  async getById(id: string): Promise<Restaurant | null> {
    const ref = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;

    const data = snapshot.data();

    return Restaurant.create({
      id: snapshot.id,
      name: data.name,
      email: data.email,
      password: data.password,
      category: data.category,
      rating: data.rating,
      imageUrl: data.imageUrl,
      menu: [] // por ahora, hasta que implementemos relación con platos
    });
  }

  async getByEmail(email: string): Promise<Restaurant | null> {
    const restaurantsRef = collection(db, COLLECTION_NAME);
    const q = query(restaurantsRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    return Restaurant.create({
      id: docSnap.id,
      name: data.name,
      email: data.email,
      password: data.password,
      category: data.category,
      rating: data.rating,
      imageUrl: data.imageUrl,
      menu: []
    });
  }

  async getByName(name: string): Promise<Restaurant[]> {
    const q = query(collection(db, COLLECTION_NAME), where("name", "==", name));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return Restaurant.create({
        id: docSnap.id,
        name: data.name,
        email: data.email,
        password: data.password,
        category: data.category,
        rating: data.rating,
        imageUrl: data.imageUrl,
        menu: []
      });
    });
  }

  async getByCategory(category: string): Promise<Restaurant[]> {
    const q = query(collection(db, COLLECTION_NAME), where("category", "==", category));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return Restaurant.create({
        id: docSnap.id,
        name: data.name,
        email: data.email,
        password: data.password,
        category: data.category,
        rating: data.rating,
        imageUrl: data.imageUrl,
        menu: []
      });
    });
  }

  async list(): Promise<Restaurant[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return Restaurant.create({
        id: docSnap.id,
        name: data.name,
        email: data.email,
        password: data.password,
        category: data.category,
        rating: data.rating,
        imageUrl: data.imageUrl,
        menu: []
      });
    });
  }
}
