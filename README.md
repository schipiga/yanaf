# yanaf
#### yet another agentic framework

Research project to develop own pet agentic framework in order to deeper understand AI-agents expectations and pitfalls. Inspired by [LangChain](https://www.langchain.com/), [LlamaIndex](https://www.llamaindex.ai/) and [BeeAI](https://i-am-bee.github.io/beeai-framework/).

This project started in order me to clarify for myself, how I imagine agentic framework, its structure and entities.

Such projects like _langchain_ or _llamaindex_ are pretty huge, and agents is only a part of them. In order to understand them, it needs to research their code, because many things and details are not covered with documentation, also codebase is large and changed often. _BeeAI_ looks smaller in comparison, but also include entities, like different types of memory, cache and so on, that can be confusing when trying to clarify what is an agentшс framework anyway, and what it should look like.

The target of project is rather to prototype the architecture, define entities and their collaboration, than to provide working solution.

So they are:
- **Agents** - workhorse, can do various intellectual work depending on the instructions:
    - **Agent** - simple agent, works in question-answer format, good for an assistant, advisor. Doesn't work with _tools_.
    - **ReActAgent** - [_Reasoning and Acting_](https://arxiv.org/abs/2210.03629) agent, according to request chooses and executes tools in order to achieve the result.
    - **PlanExecAgent** - [_Plan and Execute_](https://arxiv.org/abs/2305.04091) agent, before acting plans all his actions, then executes planned steps one-by-one in order to achieve the result.
- **LLM** - LLM client to providers, like OpenAI.
- **Dialog** - storage of agent conversation with user. As known, LLM is stateless, and doesn't remember anything. That's why for conversation contunuation needs to send all phrases from conversation beginning. When agent is instantiated it creates dialog inside itself in order to keep there user requests and llm responses.
- **Tool** - function, which agent could call (or request to call) in order to achieve the result, like internet search, geo-location, weather request, math operations, API calls, etc.
- **Memory** - Short-term memory analog of human. When agent solves issue it memorises the prompt and the result, in order to next time return the result from memory in case of same prompt instead of LLM request. Although it's tricky with prompts when result will always different like "what is time now?". So maybe more actual for tools-using agents, in order to memorize called tools, instead of generated texts, because on llm level they have pretty progressive KV-cache already.
- **Experience** - Long-term memory analog of human. Memorises similar prompts in one group and called tools for them, converting them to matrix numbers. On new prompt request agent firstly search in **Memory** then in **Experience**. **Experience** can return 
- **Workflow** - A set of executed steps, when multiple agents with different roles could be involved. Could have non-linear direction, returning back to previous stage, according to executed result.
- **Emitter** - emits _prompt_ and sends it to _workflow_. For example: slack, email, kafka. Could be connected to multiple _workflows_.
- **Listener** - receiver of _workflow_ execution result. For example: slack, email, kafka. Could be connected to multiple _workflows_.
