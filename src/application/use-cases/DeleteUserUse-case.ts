import { User } from "../../domain/entities/User";
import { ErrorDeletingUser, UserNotFoundError } from "../../shared/errors/errors";
import { UserRepository } from "../repositories/UserRepository";


export class DeleteUser{
    constructor(private userRepository:UserRepository){};

    async execute(user:User):Promise<void>{
        try{
            const userExists = await this.userRepository.findById(user.id.value);
            if(!userExists){
                throw new UserNotFoundError();
            }
            await this.userRepository.delete(user.id)
        }catch(error){
            if(error instanceof UserNotFoundError){
                throw new UserNotFoundError();
            }
            throw new ErrorDeletingUser();
        }
    }
}