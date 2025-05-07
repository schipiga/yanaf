import { Dialog } from "./dialog";
import { IAgent, IDialog, ILlm, ITool, ROLE } from "./types";
import reactPrompt from "./prompts/react";
import planexecPrompt from "./prompts/planexec";
import Mustache from "mustache";
import * as parser from "./parser";

const MAX_ITERS = 20

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

    async ask(prompt: string) {
        this.dialog.addReplica({ role: ROLE.enum.user, context: prompt });

        const response = await this.llm.request(this.dialog.getReplicas());

        this.dialog.addReplica({ role: ROLE.enum.assistant, context: response });

        return response;
    }
}

export abstract class ToolAgent extends Agent {
    tools: ITool[];

    constructor({ name, llm, instructions, tools }: { name: string, llm: ILlm, instructions: string[], tools: ITool[] }) {
        super({ name, llm, instructions })

        this.tools = tools;
    }
}

export class ReActAgent extends ToolAgent {

    constructor({ name, llm, instructions, tools }: { name: string, llm: ILlm, instructions: string[], tools: ITool[] }) {
        super({ name, llm, instructions, tools });

        const reactInstruction = Mustache.render(reactPrompt, { tools: this.tools.map(tool => tool.represent()) })

        this.dialog.addReplica({ role: ROLE.enum.system, context: reactInstruction });
    }

    async ask(prompt: string, hook?: Function, maxIters: number = MAX_ITERS) {
        let answer: string;

        this.dialog.addReplica({ role: ROLE.enum.user, context: prompt });


        for (let i = 0; i < maxIters; i++) {
            const response = await this.llm.request(this.dialog.getReplicas());

            const toolRequest = parser.parse(result);

            if (toolRequest.finalAnswer) {
                answer = toolRequest.finalAnswer;

                this.dialog.addReplica({ role: ROLE.enum.assistant, context: answer });
                break;
            }

            const toolAnswer = await hook(tool, toolRequest);
    
            const assistAnswer = Mustache.render(toolAnswerPrompt, toolAnswer);
            this.dialog.addReplica({ role: ROLE.enum.assistant, context: assistAnswer });
        }

        return answer;
    }
}

// export class PlanExecAgent extends ToolAgent {

//     constructor({ name, llm, instructions, tools }: { name: string, llm: ILlm, instructions: string[], tools: ITool[] }) {
//         super({ name, llm, instructions, tools });

//         const reactInstruction = Mustache.render(reactPrompt, { tools: this.tools.map(tool => tool.represent()) })

//         this.dialog.addReplica({ role: ROLE.enum.system, context: reactInstruction });
//     }

//     async ask(prompt: string, hook?: Function) {
//         const plan = await super.ask(prompt);
//     }
// }

//     if (this.tools.length) {
//         return parser.parse(response);
//     }


//     if (this.tools.length) {
//         const toolsInstruction = Mustache.render(toolsPrompt, { tools: this.tools.map(tool => tool.represent()) });

//         this.dialog.addReplica({ role: ROLE.enum.system, context: toolsInstruction });
//     }
// }


// if (this.tools.length) {
//     const toolsInstruction = Mustache.render(toolsPrompt, { tools: this.tools.map(tool => tool.represent()) });

//     this.dialog.addReplica({ role: ROLE.enum.system, context: toolsInstruction });
// }