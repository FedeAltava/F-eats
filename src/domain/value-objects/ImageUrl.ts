
import { ValueObject } from "./shared/value-object";

interface ImageUrlProps {
  value: string;
}

export class ImageUrl extends ValueObject<ImageUrlProps> {
  get value(): string {
    return this.props.value;
  }

  public static create(url: string): ImageUrl {
    if (!url) {
      throw new Error("Image URL is required");
    }

    try {
      new URL(url);
    } catch {
      throw new Error("Invalid URL format");
    }

    return new ImageUrl({ value: url });
  }
}
