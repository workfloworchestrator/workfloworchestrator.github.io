# How to run a companion agent with docker-agent

This guide shows you how to run an agent for another system next to the Orchestrator Agent, with its own tools,
instructions and model, so that a planner can combine the answers of both over [A2A](https://a2a-protocol.org/latest/).
To decide whether you need a separate agent at all, see [How to connect another system through a planner](connect-service.md).

The steps use [docker-agent](https://github.com/docker/docker-agent) with Docker Compose, and the `inventory-agent` of
the [example orchestrator](https://github.com/workfloworchestrator/example-orchestrator), which reads NetBox through
its MCP server. You need an MCP server for your system; to run one, see
[Run an MCP server for the service](connect-service.md#1-run-an-mcp-server-for-the-service).

## Steps

### 1. Declare the agent and its tools

Create a folder for the agent, for example `docker/inventory-agent/`, with an `agent.yaml`:

```yaml
agents:
  inventory:
    model: openai/gpt-4o
    # Published in the agent card. A planner reads it to decide when to call this agent.
    description: "Read-only NetBox network inventory agent: sites, devices, interfaces, cables, prefixes, IP addresses, VLANs and L2VPNs."
    instruction_file: instructions.md
    toolsets:
      - type: mcp
        remote:
          url: http://netbox-mcp:8000/mcp
          transport_type: streamable
        allow_private_ips: true  # needed for addresses inside a compose network
```

Make the `description` specific: the planner uses it to choose between agents.

If your agent also needs WFO data, add the Orchestrator Agent as an A2A peer, as in
[How to connect another agent over A2A](../../../orchestrator-agent/guides/a2a-planner.md#steps). Do not add the MCP server of Orchestrator Core as a
toolset: the agent would get only the raw tools of Core, without the plugins, guards and workflow approval of the
Orchestrator Agent. See [Different ways to reach the same agent](../../../orchestrator-agent/explanation/index.md#different-ways-to-reach-the-same-agent).

### 2. Write its instructions

Put the system prompt in `instructions.md` next to `agent.yaml`. Describe what the agent is for, what data it can
reach and how it should answer. Leave how each tool is used to the descriptions of the tools themselves:

```markdown
You are a read-only inventory agent for NetBox. You answer questions about the network
inventory: sites, devices, interfaces, cables, prefixes, IP addresses, VLANs and L2VPNs.
Your tools and their usage are described by the NetBox MCP server they come from.

## Rules

- You are strictly read-only; refuse anything that asks to change inventory.
- Prefer narrow, filtered queries over dumping whole tables.
- Report identifiers verbatim so callers can cross-reference.
- If a query returns nothing, say so plainly; never invent inventory.
```

### 3. Serve it over A2A

Add a service to your compose file that runs `docker-agent serve a2a` on the folder. Set the model's API key
(`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) in its environment:

```yaml
services:
  inventory-agent:
    image: docker/docker-agent:1.125.0
    command: ["serve", "a2a", "/config/agent.yaml", "--listen", "inventory-agent:8080"]
    environment:
      OPENAI_API_KEY: ${AGENT_API_KEY:-}
      TELEMETRY_ENABLED: "false"
    volumes:
      - ./docker/inventory-agent:/config:ro
    depends_on:
      - netbox-mcp
    ports:
      - "127.0.0.1:8092:8080"
```

Listen on the service name, not on `0.0.0.0` or `localhost`. The agent card advertises the listen address, and a
planner cannot reach `localhost`.

### 4. Connect it to a planner

Add the agent card URL as a peer of a planner, next to the Orchestrator Agent, and tell the planner when to use it.
See [How to connect another agent over A2A](../../../orchestrator-agent/guides/a2a-planner.md).

Restart the planner whenever you restart this agent: the card is read at startup.

## Verify it works

1. Fetch the agent card:

    ```shell
    curl --fail http://localhost:8092/.well-known/agent-card.json
    ```

    The URL in it should be the service name, not `localhost`, and the description should say what the agent is for.

2. Ask the planner a question that needs both agents, for example *Which sites exist in NetBox, and how many nodes
   are in WFO?* The answer should combine both.

## Next steps

- If the service has per-user permissions, configure identity forwarding in its own integration. The Orchestrator
  Agent does not forward credentials to this companion agent. See
  [Authentication and authorization](../../../orchestrator-agent/explanation/auth.md) for the WFO part of the chain.
- Before changing the Orchestrator Agent's prompts or model, use
  [How to benchmark prompt and model changes](../../../orchestrator-agent/guides/evals.md).
  The bundled WFO benchmark does not evaluate the companion agent or planner; give those their own checks.

## Reference

- [Endpoints and protocols: A2A](../../../orchestrator-agent/reference/endpoints.md#a2a)
- [Running the agent in your own stack](../production.md), for deployment shapes and identity
