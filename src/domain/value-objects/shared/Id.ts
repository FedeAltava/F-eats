
import { v4 as uuidv4 } from 'uuid';
import { ValueObject } from './value-object';

interface IdProps {
    value: string;
}

export class Id extends ValueObject<IdProps> {
    private constructor(props: IdProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }


    public static generate(): Id {
        return new Id({ value: uuidv4() });
    }


    public static create(id: string): Id {
        if (!id) {
            throw new Error("Id is required");
        }


        return new Id({ value: id });
    }
}
