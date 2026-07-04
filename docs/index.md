# Workflow Orchestrator programme

Welcome to the Workflow Orchestrator programme homepage. This open-source collaboration develops software, tools and
best practices for automating and orchestrating networks. Our vision is to create an ecosystem of Software that enables
users to Automate and Orchestrate their network.

<p align="center"><em>Production ready Workflow Orchestration to manage product lifecycle and workflows. Easy to use,
built on open source software.</em></p>

The Workflow Orchestrator software ecosystem is maintained by its members and all individual code contributors. More
information about the contributors can be found [here](members.md).

## Orchestration

When do you orchestrate and when do you automate? The answer is you probably need both. Automation helps you execute
repetitive tasks reliably and easily. Orchestration adds a layer and allows you to add more intelligence to the tasks
you need to automate and to have a complete audit log of changes.

## Goal

Workflow Orchestrator provides a framework with which you can manage service orchestration for your end-users. The
framework helps and guides you through the steps from automation to orchestration. The Workflow Orchestrator allows you
to define products to which users can subscribe. This helps you to intelligently manage their lifecycle, with the use
of creation, modification, validation, and termination workflows.

## Tooling

The WFO programme maintains an entire ecosystem of tooling, a non-comprehensive list in no
particular order:

- [Orchestrator-Core](https://github.com/workfloworchestrator/orchestrator-core): This Python
  program leverages the power of FastAPI to create an orchestration engine. Downloads:
  [![pypi-downloads](https://static.pepy.tech/badge/orchestrator-core)](https://pepy.tech/project/orchestrator-core).
- [Orchestrator-UI](https://github.com/workfloworchestrator/orchestrator-ui-library): Component
  library for our NextJS app on top of the Orchestrator-core. Downloads:
  [![npm-downloads](https://img.shields.io/npm/dt/%40orchestrator-ui%2Forchestrator-ui-components)](https://github.com/workfloworchestrator/orchestrator-ui-library).
- [Orchestrator Example UI](https://github.com/workfloworchestrator/example-orchestrator-ui/):
  Example UI with a NextJS implementation of our component library.
- [LSO](https://workfloworchestrator.org/lso): This application provides an API layer on top of
  Ansible playbooks.
- [Example Orchestrator](https://github.com/workfloworchestrator/example-orchestrator): This
  repository houses a Docker-compose running a full stack of the Orchestrator, UI and Netbox. It
  includes examples our best (coding) practices and an example integration with Netbox.
- [PyNSO-Restconf](https://workfloworchestrator.org/pynso-restconf): A thin client for interfacing
  with Cisco NSO using RESTCONF.
- [Pydantic-Forms](https://github.com/workfloworchestrator/pydantic-forms): A library that includes
  standardized Python Form classes that can be used when generating form components from
  JSON-schema.
- [SuPA](https://workfloworchestrator.org/SuPA): An NSI Ultimate provider agent with a gRPC API.
- [PolyNSI](https://github.com/workfloworchestrator/polynsi): A bidirectional SOAP to gRPC
  translating proxy server for the NSI protocol.

### Join the community

You can find this community on Discord. Feel free to join [us](https://discord.gg/fQkQn5ajFR) ![Discord](https://img.shields.io/discord/1295834294270558280?style=flat&logo=discord&label=discord&link=https%3A%2F%2Fdiscord.gg%2fQkQn5ajFR)
