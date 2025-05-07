import { IEmitter, IWorkflow } from "./types";

export abstract class Emitter implements IEmitter {
    workflows: IWorkflow[];

    connectWorkflow(workflow: IWorkflow): void {
        this.workflows.push(workflow);
    }
}
