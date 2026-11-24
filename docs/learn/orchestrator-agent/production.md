---
description: "Choices, problems and possible solutions for running the Orchestrator Agent in production: clients, identity, deployment shapes, models and evals, observability, gateways and proxies."
---

# Running the agent in your own stack

Getting the agent up and running on a laptop, or even internally, is one thing. Getting it running in production and
keeping it running there is another. This page covers the choices you may have to make, the problems you may run into
and some possible solutions. Every stack is different, so the page does not give one deployment recipe. Instead it
helps you pick the path that fits your environment, and links to the guides that go into detail. The sections are
things you may want to think about, not steps to follow in order or a checklist to complete.

The page covers:

- [Identity](#identity): how identity works in an agentic stack.
- [Deployment shapes](#deployment-shapes): where the agent runs.
- [Models and evals](#models-and-evals): which model the agent uses, and how you know a change does not break it.
- [Why you should observe](#why-you-should-observe): what tracing shows that logs and chat windows don't.
- [Gateways and proxies](#gateways): what you put in front of the agent once real users and other agents reach it.

## Identity

On a laptop, nobody logs in. In production the question that matters most is not "may this user call the agent?" but
"whose token does the agent send to Orchestrator Core?". Orchestrator Core runs its own authorization checks, so the
answer decides what the agent may do on behalf of the person asking.

There are two answers:

- **The user's token.** The client sends the user's token, and the agent forwards it to Orchestrator Core. Core sees
  the person and applies its policies to them. A chat UI forwards the token from its own OIDC login; a harness sends a
  bearer header; on A2A the token travels inside the message, not in the HTTP header.
- **A service account.** When there is no user token, the agent can sign in as itself with the OAuth2
  client-credentials grant. This is simpler and works for callers without a user, such as scheduled jobs. But Core
  then sees the agent, not the person, and a service account with the rights of all its callers lets each caller ask
  for more than they may do themselves. See
  [User identity and service-account permissions](../../orchestrator-agent/explanation/auth.md#why-the-users-token-is-better-than-a-service-account).
  The problem grows with every agent and MCP server you add: each hop needs to know who the request is for. That is
  one of the questions a gateway answers, see [Gateways and proxies](#gateways) and the Virge.io blog post
  [Why (y)our agents need a gateway (part 1)](https://virge.io/en/blog/why-your-agents-need-a-gateway-part-1/){target="_blank" rel="noopener"}
  :octicons-link-external-16:.

Problems you may run into:

- **A planner acts as the service account.** A2A callers that only send the HTTP header get past the agent's check,
  but Core sees the service account. Put the user's token in the message metadata.
- **The agent's `/mcp` never forwards the user's token.** Core always sees the service account on that path. If Core
  must see the user, use another path or the MCP server of Core itself.
- **The token does not fit the next hop.** Forwarding only works when the agent and Core accept the same token. When
  they need different audiences or scopes, token exchange ([RFC 8693](https://datatracker.ietf.org/doc/html/rfc8693))
  swaps it for one meant for Core. The agent does not do this itself; your identity provider or a gateway can.

See [Authentication and authorization](../../orchestrator-agent/explanation/auth.md#outbound-who-the-agent-acts-as)
for which token reaches Core on which endpoint, and
[How to configure authentication and authorization](../../orchestrator-agent/guides/secure-agent.md) to set it up.

## Deployment shapes

The agent is one container, [published on GitHub](https://github.com/workfloworchestrator/orchestrator-agent/pkgs/container/orchestrator-agent),
that needs Orchestrator Core, its database and a model. Three shapes are common:

- **Compose on a VM.** The agent runs next to Orchestrator Core, with a chat UI and possibly other agents in the same
  Compose project. This is the shape of the
  [example orchestrator](https://github.com/workfloworchestrator/example-orchestrator), and it fits a single
  team or a first production setup.
- **Kubernetes with an agent platform.** Agents are declared as resources, for example with
  [kagent](https://kagent.dev/docs/kagent), and the Orchestrator Agent runs as your own image next to the other
  agents. A planner hands questions to it over A2A.
- **Agent only, behind an existing platform.** You already have a chat or agent platform. It calls the agent over MCP
  or A2A, and the agent is one more service behind it.

## Models and evals

The agent works by calling tools, so the model has to call tools well. You can use a hosted model (OpenAI, Azure
OpenAI, Anthropic), a self-hosted one (Ollama or another OpenAI-compatible server) or a model behind a proxy such as LiteLLM. The choice is mostly
about three things:

- **Data residency.** Questions, and the subscription data the agent reads to answer them, go to the model. A hosted
  model sends them outside your infrastructure. See
  [The language model interprets the request](../../orchestrator-agent/explanation/index.md#the-language-model-interprets-the-request).
- **Quality.** A small local model may pick the wrong tools or arguments, and give plausible but wrong answers.
- **Cost.** A different model can take a different route, with a different number of calls and tokens.

A model or prompt that works today can stop working after an upgrade, a new model version from the provider or a
change to the domain context. Ordinary tests don't catch that, because the code did not change. The evals do: they run
the agent against a seeded Orchestrator Core and check which tools it calls, in which order and with which arguments.
Run them before you switch models or change a prompt, and gate CI on them.

- [Change the language model](../../orchestrator-agent/guides/own-llm.md)
- [Understanding agent evaluations](../../orchestrator-agent/explanation/evaluation.md)
- [How to benchmark prompt and model changes](../../orchestrator-agent/guides/evals.md)
- [How to add an evaluation case](../../orchestrator-agent/guides/add-eval-case.md)

## Why you should observe

When an answer is wrong, slow or expensive, the chat window only shows the last step. Logs show that something
happened, not why. A trace keeps the steps together: the question, which tools the model picked, with which arguments,
what came back and how long each step took. That is what you need to fix a wrong answer, find a run that loops, or see
where the money goes.

Tracing also closes the loop with the evals. A bad answer found in a trace already contains the question and the route
the agent took. Write down the route it should have taken, and it becomes an eval case that runs on every later change.

Things to decide before you turn it on:

- **Where the traces go.** Traces contain questions, prompts and the data the model read, including customer and
  network data. Treat the tracing backend like the model provider: where does the data go, who can read it, how long is
  it kept.
- **Which backend.** Langfuse is built in. Other OpenTelemetry backends work with their own exporter configuration,
  but have not been tested with the agent.
- **One request across services.** With tracing enabled, MCP tool-call metadata carries trace context, but the
  built-in integration does not propagate it through HTTP `traceparent` headers, including on MCP and form-fill
  requests. Orchestrator Core records no traces by default. There is no built-in, verified trace spanning the chat UI,
  the agent and Core; each service needs its own tracing configuration. You can correlate available logs and traces
  manually using timestamps and identifiers, including user identity where preserved. A gateway can help propagate
  trace context, but recording and propagation must also be configured across the participating services. See
  [Tracing and observability](../../orchestrator-agent/explanation/observability.md#not-included).

See [Tracing and observability](../../orchestrator-agent/explanation/observability.md) and
[How to trace the agent](../../orchestrator-agent/guides/tracing.md).

## Gateways and proxies { #gateways }

### What the example setup does

In the [example orchestrator](https://github.com/workfloworchestrator/example-orchestrator), LibreChat has no A2A
client, like many chat UIs, portals and services, so it reaches the agents through a small proxy,
[kagent-a2a-proxy](https://github.com/nren-agents/kagent-a2a-proxy) (the `a2a-proxy` service in
`docker-compose.agents.yml`). The proxy turns OpenAI chat completions into A2A calls, using a fixed map from model
name to agent URL. In effect it is a hand-wired gateway for one protocol, one client and no users. That is enough for
a laptop, but it leaves open questions that matter as soon as you run the agent for real:

- **No identity.** The proxy accepts any API key and Orchestrator Core runs without OAuth, so every request is
  anonymous. Nothing downstream can decide per user or per agent.
- **Not the only way in.** LibreChat also calls the MCP servers of Orchestrator Core and NetBox directly, and the
  agents call each other over A2A. A check you add to the proxy covers only one of those paths.
- **No limits and no shared trace.** There is no rate limit or budget per caller, and LibreChat, the proxy, the agents
  and Orchestrator Core each log on their own.
- **Fixed addresses.** Agent URLs and agent cards point at container addresses, see
  [Deployment shapes](#deployment-shapes).

### Questions a gateway answers

Once you have real users, machine callers or MCP servers you don't own, every request has to answer the same
questions. No single agent or MCP server should answer them on its own:

- **Who is calling, and for whom?** A user, an agent acting for a user, or an agent on its own. A shared service
  account (see [Identity](#identity)) hides the difference and grants more than the caller may do.
- **Which credential goes to the next hop?** Forwarding the user's token to an MCP server you don't own hands it a
  credential your own backends accept.
- **Which agents and tools may the caller see?** MCP lists every tool of a server, including `create_workflow`,
  unless something filters that list per caller.
- **How much may the caller spend?** An alert on cost does not stop an agent stuck in a loop; a budget per user and
  per agent does.
- **What happened?** One trace from the chat message to the audit log of Orchestrator Core, see
  [Why you should observe](#why-you-should-observe).

The agent itself answers only the first half of the first question: it checks who calls it and whether they may. It
sets no rate limits or budgets, and does not filter which tools a caller can see. See
[What the agent does not do: gateways](../../orchestrator-agent/explanation/auth.md#what-the-agent-does-not-do-gateways).

Virge.io helped develop the Orchestrator Agent and runs it in its own stack. On its website it works these questions
out as requirements for a gateway, in the blog post
[Why (y)our agents need a gateway (part 1)](https://virge.io/en/blog/why-your-agents-need-a-gateway-part-1/){target="_blank" rel="noopener"}
:octicons-link-external-16:.

### When you need one

Put a gateway in front once you have several clients, machine callers, quotas or a central audit log, instead of
extending the proxy of the example setup. Two kinds are common, and you may need both:

- **An API or agent gateway** in front of the agents and MCP servers: it decides who may call what, filters tools and
  enforces budgets per caller.
- **A model proxy**, such as LiteLLM, between the agents and the model providers: it gives one place for model keys,
  provider switching and cost per model.
