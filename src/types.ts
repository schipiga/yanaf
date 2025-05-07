import { z } from "zod";

export interface IAgent {
    name: string;
    llm: ILlm;
    dialog: IDialog;
    ask(prompt: string): Promise<string>;
};

export interface ILlm {
    request(req: Replica[]): string;
};

export interface IDialog {
    replicas: Replica[];
    addReplica(replica: Replica): void;
    getReplicas(): Replica[];
};

export interface ITool {
    name: string;
    schema: object;
    func: Function;
    exec(...args): Promise<unknown>;
    represent(): string;
};

export interface IWorkflow {
    listeners: IListener[];
    stages: Map<string, (context: object) => Promise<string>>;
    connectListeners(listener: IListener): void;
    run(prompt: string, maxSteps: number): Promise<string>;
    addStage(name: string, hook: (context: object) => Promise<string>): void;
};

export interface IEmitter {
    workflows: IWorkflow[];
    connectWorkflow(workflow: IWorkflow): void;
};

export interface IListener {
    delivery(message: string): void;
};

export interface IMemory {
    remembrances: Map<string, unknown>;
    remember(prompt: string, result: unknown): void;
    recall(prompt: string): unknown;
};

export interface IExperience {
    remembrances: Map<string, unknown>;
    gain(prompt: string, result: unknown): void;
    extract(prompt: string): unknown;
};

export const ROLE = z.enum(["system", "assistant", "user"]);

export type Role = z.infer<typeof ROLE>;

const replica = z.object({
    role: ROLE,
    context: z.string(),
});

export type Replica = z.infer<typeof replica>;
