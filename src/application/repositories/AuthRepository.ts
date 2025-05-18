// src/application/repositories/AuthRepository.ts
export type UserRole = "user" | "restaurant";

export interface AuthRepository {

  signUp(email: string, password: string, role: UserRole): Promise<string>;


  signIn(email: string, password: string): Promise<{ uid: string; role: UserRole }>;


  signOut(): Promise<void>;
}
