import { User } from '../../domain/entities/User';
import { Id } from '../../domain/value-objects/shared/Id';

export interface UserRepository {
  create(user: User): Promise<void>;
  update(user: User): Promise<void>;
  delete(id: Id): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  list(): Promise<User[]>;
}

