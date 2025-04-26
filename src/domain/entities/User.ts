import { Entity } from "./shared/Entity";

import { Name } from "../value-objects/Name";
import { Id } from "../value-objects/shared/Id";
import { Email } from '../value-objects/Email';
import { Password } from '../value-objects/Password';

interface UserOjectData{
    id:Id,
    name:Name,
    email:Email,
    password:Password,
}

interface UserData{
    id?:string,
    name:string,
    email:string,
    password:string,
}

export interface userUpdateData {
    name?: string;
    email?: string;
    password?: string;
  }

export class User extends Entity{
    public readonly name: Name;
    public readonly email: Email;
    public readonly password: Password;

    private constructor(data:UserOjectData){
        super(data.id);
        this.id = data.id; 
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
    }

    public static create(data:UserData): User{
        const id = !data.id ? Id.generate() : Id.create(data.id); 
        const name = Name.create(data.name)
        const email = Email.create(data.email)
        const password = Password.create(data.password)
        return new User({ id, name, email, password });
    }

    public  update(data: userUpdateData): User {
        const name = !data.name ? this.name : Name.create(data.name);
        const email = !data.email ? this.email : Email.create(data.email);
        const password = !data.password ? this.password :  Password.create(data.password);
        return new User({id:this.id, name, email, password });
    } 

    public toJSON() {
        return {
            id: this.id.value,
            name: this.name.value,
            email: this.email.value
        }
    }
    
    public toPersistence() {
        return {
            id: this.id.value,
            name: this.name.value,
            email: this.email.value,
            password: this.password.value
        }
    }
    
}
