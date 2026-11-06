---
description: "The Orchestrator Agent from first question to production: what it can do, how to try it, what data it touches, and how to run it in your own stack."
---

# Orchestrator Agent: from first question to production

The [Orchestrator Agent](https://github.com/workfloworchestrator/orchestrator-agent) lets people and other agents work
with your WFO in plain language: search and count subscriptions, look up details, export results and start workflows.
It is a ready-to-use agent built on the tools that the
[MCP server](../../orchestrator-core/reference-docs/mcp.md) of Orchestrator Core exposes.

This page follows the questions you have along the way, from knowing nothing about the agent to running it live. See
what it can do, try it on the example orchestrator, learn what data it touches, apply it to your own stack, deploy it
and keep it working. Each section is short and points to the tutorial, the guides and the reference that go into
detail.

## What can I do with it?

The agent is reachable in several ways, so you can fit it into your own agentic setup:

<span class="wfo-protocol wfo-protocol--chat">Chat</span> **OpenAI chat completions**: use it as a chat model
  in LibreChat or any other OpenAI-compatible client.

<span class="wfo-protocol wfo-protocol--a2a">A2A</span> **A2A**: let other agents, such as a planner, hand
  questions and tasks to it.

<span class="wfo-protocol wfo-protocol--agui">AG-UI</span> **AG-UI**: stream answers, tables and charts into your
  own web frontend.

<span class="wfo-protocol wfo-protocol--mcp">MCP</span> **MCP**: call it as a tool from MCP clients such as Claude
  Code or an agent framework.

The use cases below are based on the
[example orchestrator](https://github.com/workfloworchestrator/example-orchestrator). Search, aggregate, look up and
export work over every protocol.

<div class="grid cards cols-3" markdown>

-   **Search**

    <span class="wfo-protocol wfo-protocol--chat">Chat</span>

    *"Which L2VPNs run on node X?"*

    Matching subscriptions, ranked by relevance.

    - [How-to: Enable AI search](../../orchestrator-core/reference-docs/ai-search.md#running-it)
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

    - [How-to: Start workflows from chat](use-cases/workflows-from-chat.md)
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

    - [How-to: Change the language model](../../orchestrator-agent/guides/own-llm.md)
    - [How to benchmark prompt and model changes](../../orchestrator-agent/guides/evals.md)

    ![Use your own LLM](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

</div>

### Beyond networking

Workflow Orchestrator is not limited to networks. It models products, services and workflows of any domain, see
[At A Glance](../../architecture/at-a-glance.md). The agent works on the models of your own domain, so the same use
cases apply wherever you use WFO.

<div class="grid cards cols-3" markdown>

-   **Answers in your own portal**

    <span class="wfo-protocol wfo-protocol--agui">AG-UI</span>

    *"Which of my services renew next quarter?" then "export them"*

    Answers, tables and charts streamed into a self-service portal of your own, with follow-ups on the same thread.

    - [Use case: Chat in your own frontend](use-cases/chat-in-your-frontend.md)
    - [AG-UI protocol reference](../../orchestrator-agent/reference/endpoints.md#ag-ui)

    ![Answers in your own portal](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **WFO as a tool for your assistant**

    <span class="wfo-protocol wfo-protocol--mcp">MCP</span>

    *"Which products have no active subscriptions?"*

    WFO questions answered from the assistant or agent framework you already use, such as Claude Code.

    - [How-to: Use the agent with MCP](../../orchestrator-agent/guides/mcp-clients.md)

    ![WFO as a tool for your assistant](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

</div>

## How can I try it out myself?

Follow the [tutorial](tutorials/example-orchestrator.md). It runs the agent, a planner and a NetBox agent on the example orchestrator, with
LibreChat as the chat frontend, and walks through the use cases above. You only need the example orchestrator and an
API key for an LLM provider.

## How does it work, and what data does the agent touch?

- [How the agent fits on top of Orchestrator Core](../../orchestrator-agent/architecture/index.md): how Core, the model, the database
  and different clients work together.
- [The language model](../../orchestrator-agent/architecture/index.md#the-language-model-interprets-the-request) and
  [conversation storage](../../orchestrator-agent/architecture/index.md#the-database-stores-the-conversations):
  where requests are processed and why the agent needs database access.
- [The agent needs approval before starting workflows](../../orchestrator-agent/architecture/index.md#the-agent-needs-approval-before-starting-workflows): how
  interpreting a request is kept separate from authorising a change.

## How can I apply it to our stack?

- [Getting started](../../orchestrator-agent/getting-started.md): run the agent on your own Orchestrator Core. See
  the [prerequisites](../../orchestrator-agent/getting-started.md#prerequisites) for what it needs.
- Connect your clients: [LibreChat](../../orchestrator-agent/guides/librechat.md),
  [MCP clients](../../orchestrator-agent/guides/mcp-clients.md),
  [an A2A planner](../../orchestrator-agent/guides/a2a-planner.md) or
  [an AG-UI frontend](../../orchestrator-agent/reference/endpoints.md#ag-ui).
- Once several clients, other agents or
  machine callers reach the agent, decide in one place, in front of it, who may call it, what they may see and how much
  they may spend. See [Gateways](production.md#gateways).
- Fit it to your data: [Add domain context](../../orchestrator-agent/guides/domain-context.md),
  [Expose your own Core routes as tools](../../orchestrator-core/reference-docs/mcp.md#extending),
  [Connect another system through a planner](integrations/connect-service.md),
  [Run a companion agent with docker-agent](integrations/create-agent.md) and
  [Enable AI search and embeddings](../../orchestrator-core/reference-docs/ai-search.md#running-it).
- Choose your model: [Change the language model](../../orchestrator-agent/guides/own-llm.md).
- Look up the details in the reference:
  [Endpoints and protocols](../../orchestrator-agent/reference/endpoints.md) and
  [Configuration](../../orchestrator-agent/reference/configuration.md).

## How do I deploy it live?

- [Running the agent in your own stack](production.md): the choices for
  production, such as which clients connect, who they act as, where the agent runs, which model it uses and what you put
  around it.
- [How to configure authentication and authorization](../../orchestrator-agent/guides/secure-agent.md): authenticate users, authorize them with OPA and
  call Orchestrator Core as them. [Authentication and authorization](../../orchestrator-agent/architecture/auth.md)
  explains which token reaches Orchestrator Core on which endpoint.

## How do I keep it working?

- [Understanding agent evaluations](../../orchestrator-agent/architecture/evaluation.md): why prompt and model changes need
  a benchmark.
- [How to benchmark prompt and model changes](../../orchestrator-agent/guides/evals.md): run the evals before you change a
  prompt or a model, and gate CI on them.
- [How to add an evaluation case](../../orchestrator-agent/guides/add-eval-case.md): protect a request or observed failure
  with checks in the dataset.
- [How to trace the agent](../../orchestrator-agent/guides/tracing.md): follow requests and costs in Langfuse or another
  OpenTelemetry backend. [Tracing and observability](../../orchestrator-agent/architecture/observability.md) explains what
  traces show and how they feed the evals.
