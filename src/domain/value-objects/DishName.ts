import { ValueObject } from "./shared/value-object";

interface DishNameProps {
  value: string;
}

export class DishName extends ValueObject<DishNameProps> {
  private constructor(props: DishNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): DishName {
    if (!name || name.trim().length < 2 || name.trim().length > 40) {
      throw new Error("Dish name must be between 2 and 40 characters.");
    }

    return new DishName({ value: name.trim() });
  }
}
