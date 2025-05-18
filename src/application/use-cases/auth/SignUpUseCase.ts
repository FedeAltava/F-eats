
import { AuthRepository, UserRole } from "../../repositories/AuthRepository";

export class SignUpUseCase {
  constructor(private authRepo: AuthRepository) {}

  async execute(email: string, password: string, role: UserRole): Promise<string> {
    return await this.authRepo.signUp(email, password, role);
  }
}
