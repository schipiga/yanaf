import { Dialog } from "./dialog";
import { IAgent, IDialog, ILlm, ROLE } from "./types";

export class Agent implements IAgent {
    name: string;
    llm: ILlm;
    dialog: IDialog;

    constructor({ name, llm, instructions }: { name: string, llm: ILlm, instructions: string[] }) {
        this.name = name;
        this.llm = llm;
        this.dialog = new Dialog();

        for (const instruct of instructions) {
            this.dialog.addReplica({ role: ROLE.enum.system, context: instruct });
        }
    }

    ask(prompt: string) {
        this.dialog.addReplica({ role: ROLE.enum.user, context: prompt });

        return this.llm.request(this.dialog.getReplicas());
    }
}
