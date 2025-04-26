import { ValueObject } from "./shared/value-object";

const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

interface PasswordProps{
    value: string;
}

export class Password extends ValueObject<PasswordProps>{
    constructor(password:PasswordProps){
        super(password)
    }

    get value(): string {
        return this.props.value;
    }

    public static create(password:string): Password {
        if(!password){
            throw new Error("Password is required");
        }
        
        if(!PASSWORD_PATTERN.test(password)){
            throw new Error("Password is invalid");
        }

        return new Password({value:password})
    }
}