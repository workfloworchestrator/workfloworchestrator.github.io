---
description: "What the Orchestrator Agent can do: search, aggregate, look up, export and start workflows from chat."
---

# What the agent can do

orchestrator-core can expose its API as tools over the [MCP server](../../orchestrator-core/reference-docs/mcp.md),
so any agent can work with your WFO. The
[Orchestrator Agent](https://github.com/workfloworchestrator/orchestrator-agent) is a ready-to-use agent built on those
tools. See the [prerequisites](../../orchestrator-agent/getting-started.md#prerequisites) for what it needs to run.

The agent is reachable in several ways, so you can fit it into your own agentic setup:

- <span class="wfo-protocol wfo-protocol--chat">Chat</span> **OpenAI chat completions**: use it as a chat model
  in LibreChat or any other OpenAI-compatible client.
- <span class="wfo-protocol wfo-protocol--a2a">A2A</span> **A2A**: let other agents, such as a planner, hand
  questions and tasks to it.
- <span class="wfo-protocol wfo-protocol--agui">AG-UI</span> **AG-UI**: stream answers, tables and charts into your
  own web frontend.
- <span class="wfo-protocol wfo-protocol--mcp">MCP</span> **MCP**: call it as a tool from MCP clients such as Claude
  Code or an agent framework.

See [Protocols](../../orchestrator-agent/index.md#protocols) for the endpoints. The use cases below are based on the
[example orchestrator](https://github.com/workfloworchestrator/example-orchestrator). Search, aggregate, look up and
export work over every protocol. The badges on a card show which protocol that example uses. To make the agent work
well with your own products and naming, see
[Teach the agent your domain](../../orchestrator-agent/guides/domain-context.md).

## Use cases

<div class="grid cards cols-3" markdown>

-   **Search**

    <span class="wfo-protocol wfo-protocol--chat">Chat</span>

    *"Which L2VPNs run on node X?"*

    Matching subscriptions, ranked by relevance.

    - [How-to: Enable AI search](../../orchestrator-agent/guides/ai-search.md)
    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Search](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Aggregate and charts**

    <span class="wfo-protocol wfo-protocol--chat">Chat</span>

    *"How many subscriptions per product, per month?"*

    Counts and trends, ready to chart.

    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Aggregate and charts](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Look up by id**

    <span class="wfo-protocol wfo-protocol--chat">Chat</span>

    *"Show subscription 3f2a…"*

    The full details of a single subscription.

    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Look up by id](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Export**

    <span class="wfo-protocol wfo-protocol--chat">Chat</span>

    *"Export all active core links to CSV"*

    A downloadable file with the results.

    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Export](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Start workflows from chat**

    <span class="wfo-protocol wfo-protocol--chat">Chat</span> <span class="wfo-protocol wfo-protocol--a2a">A2A</span>

    *"Create a core link between Amsterdam and London"*

    A workflow started from the conversation.

    - [How-to: Start workflows from chat](../../orchestrator-agent/guides/workflows-from-chat.md)
    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Start workflows from chat](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Multi-agent: WFO + NetBox**

    <span class="wfo-protocol wfo-protocol--a2a">A2A</span>

    *"Which sites exist in NetBox, and how many nodes are in WFO?"*

    One answer combining several systems.

    - [How-to: Multi-agent over A2A](../../orchestrator-agent/guides/a2a-planner.md)

    ![Multi-agent: WFO + NetBox](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Use your own LLM**

    <span class="wfo-protocol wfo-protocol--chat">Chat</span>

    *"Compare models on your own data"*

    Model results side by side on your own questions.

    - [How-to: Use your own LLM](../../orchestrator-agent/guides/own-llm.md)
    - [How-to: Benchmark prompt and model changes](../../orchestrator-agent/guides/evals.md)

    ![Use your own LLM](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

</div>

## Where to start

- Want to try it? Follow the [tutorial](tutorial.md), which runs the agent on the example orchestrator and walks
  through these use cases.
- Want to run it on your own orchestrator-core? Go to [Getting started](../../orchestrator-agent/getting-started.md)
  in Projects / Orchestrator Agent, which also has the guides and the reference.

## WFO beyond networking

Workflow Orchestrator is not limited to networks. It models products, services and workflows of any domain, see
[At A Glance](../../architecture/at-a-glance.md). The agent works on the models of your own domain, so the same use
cases apply wherever you use WFO.

<div class="grid cards cols-3" markdown>

-   **Answers in your own portal**

    <span class="wfo-protocol wfo-protocol--agui">AG-UI</span>

    *"Which of my services renew next quarter?" then "export them"*

    Answers, tables and charts streamed into a self-service portal of your own, with follow-ups on the same thread.

    - [Use case: Chat in your own frontend](chat-in-your-frontend.md)
    - [How-to: Build a frontend with AG-UI](../../orchestrator-agent/guides/ag-ui.md)

    ![Answers in your own portal](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **WFO as a tool for your assistant**

    <span class="wfo-protocol wfo-protocol--mcp">MCP</span>

    *"Which products have no active subscriptions?"*

    WFO questions answered from the assistant or agent framework you already use, such as Claude Code.

    - [How-to: Use MCP clients](../../orchestrator-agent/guides/mcp-clients.md)

    ![WFO as a tool for your assistant](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

</div>
