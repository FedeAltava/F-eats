import { userUpdateData } from "../../../domain/entities/User";
import { ErrorUpdatingUser } from "../../../shared/errors/errors";
import { UserRepository } from "../../repositories/UserRepository";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string, data: userUpdateData): Promise<void> {
    try {
      const user = await this.userRepository.findById(id);
        if(!user){
            throw new ErrorUpdatingUser();
        }
      const updated = user.update(data)
      await this.userRepository.update(updated);
    } catch (error) {
      if (error instanceof ErrorUpdatingUser) {
        throw error;
      }
      throw new ErrorUpdatingUser();
    }
  }
}
