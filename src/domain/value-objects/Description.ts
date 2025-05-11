import { ValueObject } from "./shared/value-object";

interface DescriptionProps {
  value: string;
}

export class Description extends ValueObject<DescriptionProps> {
  private constructor(props: DescriptionProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(description: string): Description {
    if (description.trim().length > 250) {
      throw new Error("Description must be 250 characters or less.");
    }

    return new Description({ value: description.trim() });
  }
}
