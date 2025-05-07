import { IExperience } from "./types";

// FIXME: mock
const encodePrompt = o => o;
const encodeResult = o => o;
const decodePrompt = o => o;
const decodeResult = o => o;

export class Experience implements IExperience {
    remembrances: Map<string, unknown> = new Map();

    gain(prompt: string, result: unknown): void {
        this.remembrances.set(encodePrompt(prompt), encodeResult(result));
    }

    extract(prompt: string): unknown {
        return decodeResult(this.remembrances.get(decodePrompt(prompt)));
    }
}
