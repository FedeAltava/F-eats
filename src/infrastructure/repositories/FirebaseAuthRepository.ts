import { AuthRepository, UserRole } from "../../application/repositories/AuthRepository";
import { auth, db } from "../firebase/fireBaseConfig"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const PROFILE_COLLECTION = "profiles";

export class FirebaseAuthRepository implements AuthRepository {
  async signUp(email: string, password: string, role: UserRole): Promise<string> {
    const cred: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    // Guardar perfil con rol en Firestore
    await setDoc(doc(db, PROFILE_COLLECTION, uid), { email, role });
    return uid;
  }

  async signIn(email: string, password: string): Promise<{ uid: string; role: UserRole }> {
    const cred: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = cred.user.uid;
    // Leer perfil para obtener el rol
    const snap = await getDoc(doc(db, PROFILE_COLLECTION, uid));
    if (!snap.exists()) throw new Error("Profile not found");
    const data = snap.data() as { role: UserRole };
    return { uid, role: data.role };
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }
}
