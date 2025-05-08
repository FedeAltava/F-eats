import { User } from "../../../domain/entities/User";
import { ErrorListingUsers } from "../../../shared/errors/errors";
import { UserRepository } from "../../repositories/UserRepository";


export class ListUsers{
    constructor(private userRepository: UserRepository){};

    async execute():Promise<User[]>{
        try{
            return await this.userRepository.list();
        }catch(error){
            if(error instanceof ErrorListingUsers){
                throw error;
            }
            throw error;
        }
    }
}