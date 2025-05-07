import { IListener, IWorkflow } from "./types";

const MAX_ITERS = 20;

export enum STAGE {
    START = '__start__',
    SELF = '__self__',
    END = '__end__',
};

export class Workflow implements IWorkflow {
    listeners: IListener[] = [];
    stages: Map<string, (context: object) => Promise<string>> = new Map();

    connectListeners(listener: IListener): void {
        this.listeners.push(listener);
    }

    addStage(name: string, hook: (context: object) => Promise<string>): void {
        this.stages.set(name, hook);
    }

    async run(prompt: string, maxSteps: number = MAX_ITERS): Promise<string> {
        const context = { prompt, result: '' };
        let stageName: string = STAGE.START;
        let prevStageName = '';

        for (let i = 0; i < maxSteps; i++) {
            const stage = this.stages.get(stageName);
    
            if (!stage) {
                throw Error('No start stage in workflow');
            }
    
            prevStageName = stageName;
            stageName = await stage(context);

            if (stageName === STAGE.SELF) {
                stageName = prevStageName;
            }

            if (stageName === STAGE.END) {
                break;
            }
        }

        this.listeners.forEach(listener => listener.delivery(context.result));

        return context.result;
    }
}
