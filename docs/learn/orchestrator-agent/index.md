---
description: "What the Orchestrator Agent can do: search, aggregate, look up, export and start workflows from chat."
---

# What the agent can do

Ask questions about your subscriptions, products and workflows in plain language, and start workflows from the
same conversation. The Orchestrator Agent works on top of the search index and the MCP server of orchestrator-core.

![LibreChat with an answer of the Orchestrator Agent](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

Everything on this page is available in the `main` branch of the
[orchestrator-agent](https://github.com/workfloworchestrator/orchestrator-agent) repository.

## Use cases

<div class="grid cards cols-3" markdown>

-   **Search**

    *"Which L2VPNs run on node X?"*

    Matching subscriptions, ranked by relevance.

    - [How-to: Enable AI search](../../orchestrator-agent/guides/ai-search.md)
    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Search](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Aggregate and charts**

    *"How many subscriptions per product, per month?"*

    Counts and trends, ready to chart.

    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Aggregate and charts](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Look up by id**

    *"Show subscription 3f2a…"*

    The full details of a single subscription.

    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Look up by id](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Export**

    *"Export all active core links to CSV"*

    A downloadable file with the results.

    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Export](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Start workflows from chat**

    *"Create a core link between Amsterdam and London"*

    A workflow started from the conversation.

    - [How-to: Start workflows from chat](../../orchestrator-agent/guides/workflows-from-chat.md)
    - [Reference: Plugins](../../orchestrator-agent/reference/plugins.md)

    ![Start workflows from chat](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Multi-agent: WFO + NetBox**

    *"Which sites exist in NetBox, and how many nodes are in WFO?"*

    One answer combining several systems.

    - [How-to: Multi-agent over A2A](../../orchestrator-agent/guides/a2a-planner.md)

    ![Multi-agent: WFO + NetBox](../../img/orchestrator-agent/librechat-agent-orchestrator.png)

-   **Use your own LLM**

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
