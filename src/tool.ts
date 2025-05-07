import { ITool } from "./types";

export class Tool implements ITool {
    name: string;
    schema: object;
    func: Function;

    constructor(name: string, schema: object, func: Function) {
        this.name = name;
        this.schema = schema;
        this.func;
    };

    exec(...args) {
        return this.func(...args);
    }

    represent(): string {
        return JSON.stringify(this.schema);
    }
}
