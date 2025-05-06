import { IDialog, Replica } from "./types";

export class Dialog implements IDialog {
    replicas: Replica[];

    addReplica(replica: Replica): void {
        this.replicas.push(replica);
    }

    getReplicas(): Replica[] {
        return this.replicas;
    }
};
