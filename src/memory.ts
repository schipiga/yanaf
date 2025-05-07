import { IMemory } from "./types";

export class Memory implements IMemory {
    remembrances: Map<string, unknown> = new Map();

    remember(prompt: string, result: unknown): void {
        this.remembrances.set(prompt, result);
    }

    recall(prompt: string): unknown {
        return this.remembrances.get(prompt);
    }
}