import { ValueObject } from "./shared/value-object";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface EmailProps {
  value: string;
}

export class Email extends ValueObject<EmailProps> {
  constructor(email: EmailProps) {
    super(email);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(email: EmailProps): Email {
    if (!email.value) {
      throw new Error("Email is required");
    }
    if (!EMAIL_PATTERN.test(email.value)) {
      throw new Error("The email is invalid");
    }

    return new Email({ value: email.value.toLocaleLowerCase() });
  }
}
