import { ValueObject } from "./shared/value-object";

interface PriceProps {
  value: number;
}

export class Price extends ValueObject<PriceProps> {
  private constructor(props: PriceProps) {
    super(props);
  }

  get value(): number {
    return this.props.value;
  }

  public static create(price: number): Price {
    if (price < 0) {
      throw new Error("Price must be a positive number.");
    }

    return new Price({ value: price });
  }
}
