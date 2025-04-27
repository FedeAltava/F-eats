import { ValueObject } from "./shared/value-object";

interface RatingProps {
    value: number;
}

export class Rating extends ValueObject<RatingProps> {
    private constructor(props: RatingProps) {
        super(props);
    }

    get value(): number {
        return this.props.value;
    }

    public static create(rating: number): Rating {
        if (rating < 0 || rating > 5) {
            throw new Error("Rating must be between 0 and 5");
        }

        return new Rating({ value: rating });
    }
}
