import { ValueObject } from "./shared/value-object";

interface NameProps {
  value: string;
}
export class Name extends ValueObject<NameProps> {
  constructor(name: NameProps) {
    super(name);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: NameProps): Name {
    if (!name.value) {
      throw new Error("Name is required");
    }
    if (name.value.trim().length < 2 || name.value.trim().length > 15) {
      throw new Error("The name is invalid");
    }
    const cleanedName = name.value.trim();

    return new Name({ value: cleanedName });
  }
}
