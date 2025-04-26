import { v4 as uuidv4 } from 'uuid';

export class Id {
    private readonly _id: string;

    constructor(value: string){
        this._id = value;
    }

    get value(): string{
        return this._id;
    }

    public static generate(): Id {
        return new Id (uuidv4());
    }

    public static create(id:string): Id {
        return new Id(id);
    }

    equals(id?:Id): boolean {
        if( id === null || id === undefined){
            return false;
        }
        return this._id === id._id
    }
}