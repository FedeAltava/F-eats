import { ValueObject } from "./shared/value-object";

interface CategoryProps {
    value: string;
}

export class Category extends ValueObject<CategoryProps> {
    private constructor(props: CategoryProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(category: string): Category {
        if (!category || category.trim().length < 3) {
            throw new Error("Category is invalid");
        }

        return new Category({ value: category.trim() });
    }
}
