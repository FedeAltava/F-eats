import { UserRepository } from "../../application/repositories/UserRepository";
import { User } from "../../domain/entities/User";
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

const COLLECTION_NAME = "users";

export class FirebaseUserRepository implements UserRepository {
  async create(user: User): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, user.id.value);
    await setDoc(ref, user.toPersistence());
  }

  async update(user: User): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, user.id.value);
    await setDoc(ref, user.toPersistence(), { merge: true });
  }

  async delete(id: Id): Promise<void> {
    const ref = doc(db, COLLECTION_NAME, id.value);
    await deleteDoc(ref);
  }

  async findById(id: string): Promise<User | null> {
    const ref = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(ref);
    if (!snapshot.exists()) return null;

    const data = snapshot.data();

    return User.create({
      id: snapshot.id,
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const usersRef = collection(db, COLLECTION_NAME);
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data();

    return User.create({
      id: docSnap.id,
      name: data.name,
      email: data.email,
      password: data.password,
    });
  }

  async list(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, COLLECTION_NAME));
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      return User.create({
        id: docSnap.id,
        name: data.name,
        email: data.email,
        password: data.password,
      });
    });
  }
}
