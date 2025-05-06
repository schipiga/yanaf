import { z } from "zod";

export interface IAgent {
    name: string;
    llm: ILlm;
    dialog: IDialog;
    ask(prompt: string): void;
};

export interface ILlm {
    request(req: Replica[]): string;
};

export interface IDialog {
    replicas: Replica[];
    addReplica(replica: Replica): void;
    getReplicas(): Replica[];
};

export const ROLE = z.enum(["system", "assistant", "user"]);

export type Role = z.infer<typeof ROLE>;

const replica = z.object({
    role: ROLE,
    context: z.string(),
});

export type Replica = z.infer<typeof replica>;
