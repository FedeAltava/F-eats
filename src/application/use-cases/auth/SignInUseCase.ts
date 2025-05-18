
import { AuthRepository } from "../../repositories/AuthRepository";

export class SignInUseCase {
  constructor(private authRepo: AuthRepository) {}

  async execute(email: string, password: string): Promise<{ uid: string; role: string }> {
    return await this.authRepo.signIn(email, password);
  }
}
