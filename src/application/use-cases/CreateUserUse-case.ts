import { User } from "../../domain/entities/User";
import { ErrorCreatingUser, UserAlreadyExistsError } from "../../shared/errors/errors";
import { UserRepository } from "../repositories/UserRepository";


export class CreateUser{
    constructor(private userRepository : UserRepository){};

    async execute(user:User):Promise<void>{
        try{
            const userExists = await this.userRepository.findByEmail(user.email.value);
            if(userExists){
                throw new UserAlreadyExistsError();
            }
            await this.userRepository.save(user);
        }catch(error){
            if(error instanceof UserAlreadyExistsError){
                throw new UserAlreadyExistsError();
            }
            throw new ErrorCreatingUser();
        }
    }
}