---
hide:
  - navigation
  - toc
---
# Workflow Orchestrator Programme
Welcome to the Workflow Orchestrator Programme homepage. This opensource collaboration develops software, tools and best practices for automating and orchestrating networks. Our vision is to create an ecosystem of Software that enables users to Automate and Orchestrate their network.

## Documentation
- Find workflow & product modeling, reference documentation and workshop information of the Workflow Orchestrator [here](https://workfloworchestrator.org/orchestrator-core)


## Core tooling:
The Core tooling developed by the programme:

- [Orchestrator-Core](https://github.com/workfloworchestrator/orchestrator-core): This Python Programme leverages the power of FastAPI to create an orchestration engine. Downloads: 
[![pypi-downloads](https://static.pepy.tech/badge/orchestrator-core)](https://pepy.tech/project/orchestrator-core)
- [Orchestrator-UI](https://github.com/workfloworchestrator/orchestrator-ui-library) Component library for our NextJS 
app on top of the Orchestrator-core. Downloads: 
[![npm-downloads](https://img.shields.io/npm/dt/%40orchestrator-ui%2Forchestrator-ui-components)](https://github.com/workfloworchestrator/orchestrator-ui-library)
- [Orchestrator Example UI](https://github.com/workfloworchestrator/example-orchestrator-ui/) Example ui with a NextJS 
implementation of our component library. 

## Other Software:
Software maintained by the Workflow Orchestrator programme:

- [LSO](https://workfloworchestrator.org/lso): This application provides an API layer on top of Ansible playbooks.
- [Example Orchestrator](https://github.com/workfloworchestrator/example-orchestrator): This repository houses a 
Docker-compose running a full stack of the Orchestrator, UI and Netbox. It includes examples our best (coding) practices
and an example integration with Netbox
- [PyNSO-Restconf](https://workfloworchestrator.org/pynso-restconf): A thin client for interfacing with Cisco NSO using 
Restconf
- [Pydantic-Forms](https://github.com/workfloworchestrator/pydantic-forms): A library that includes standardised Python 
Form classes that can be used when generating form components from JSON-schema
- [SuPA](https://workfloworchestrator.org/supa): An NSI Ultimate provider agent with a gRPC api
- [PolyNSI](https://github.com/workfloworchestrator/polynsi): A Soap to gRPC NSI proxy