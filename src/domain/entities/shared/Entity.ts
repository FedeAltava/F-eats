import { Id } from "../../value-objects/shared/Id";
export interface EntityData {id: Id}

const isEntity = (v: unknown): v is Entity => v instanceof Entity;

export abstract class Entity implements EntityData {
    protected constructor(public id: Id) {}

    public equals(object?: Entity): boolean {
        if (object == null || object == undefined) {
            return false;
        }

        if (this === object) {
            return true;
        }

        if (!isEntity(object)) {
            return false;
        }

        return this.id.equals(object.id);
    }
}