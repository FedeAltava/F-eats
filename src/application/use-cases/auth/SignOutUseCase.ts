
import { AuthRepository } from "../../repositories/AuthRepository";

export class SignOutUseCase {
  constructor(private authRepo: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepo.signOut();
  }
}
