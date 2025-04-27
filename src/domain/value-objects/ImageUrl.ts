import { ValueObject } from "./shared/value-object";

interface ImageUrlProps {
    value: string;
}

const URL_PATTERN = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;

export class ImageUrl extends ValueObject<ImageUrlProps> {
    private constructor(props: ImageUrlProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(url: string): ImageUrl {
        if (!url || !URL_PATTERN.test(url)) {
            throw new Error("Invalid image URL");
        }

        return new ImageUrl({ value: url });
    }
}
