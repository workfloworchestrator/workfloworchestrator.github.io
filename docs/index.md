---
hide:
  - navigation
  - toc
---

<div class="homepage" markdown="1">

# Workflow Orchestrator programme

Welcome to the Workflow Orchestrator programme homepage. This open-source collaboration develops software, tools and
best practices for automating and orchestrating networks. Our vision is to create an ecosystem of Software that enables
users to Automate and Orchestrate their network.

<p align="center"><em>Production ready Workflow Orchestration to manage product lifecycle and workflows. Easy to use,
built on open source software.</em></p>

<p align="center">
    <a href="https://discord.gg/fQkQn5ajFR">
    <img src="https://img.shields.io/discord/1295834294270558280?style=flat&logo=discord&label=discord" alt="Discord">
    </a>
    <a href="https://github.com/workfloworchestrator">
    <img src="https://img.shields.io/badge/GitHub-workfloworchestrator-181717?style=flat&logo=github" alt="GitHub">
    </a>
    </p>

The Workflow Orchestrator software ecosystem is maintained by its [Members](members.md) and all individual code contributors.

## Orchestration

When do you orchestrate and when do you automate? The answer is you probably need both. Automation helps you execute
repetitive tasks reliably and easily. Orchestration adds a layer and allows you to add more intelligence to the tasks
you need to automate and to have a complete audit log of changes.

> #### Orchestrate[*](https://www.lexico.com/en/definition/orchestrate) - Transitive Verb
> /ˈôrkəˌstrāt/ /ˈɔrkəˌstreɪt/
>
>   1: Arrange or score (music) for orchestral performance.
>   *‘the song cycle was stunningly arranged and orchestrated’*
>
>   2:  Arrange or direct the elements of (a situation) to produce a desired effect, especially surreptitiously.
>   *‘the developers were able to orchestrate a favorable media campaign’*

## Project Goal

The **Workflow Orchestrator** provides a framework through which you can manage service orchestration for
your end-users. The framework helps and guides **you**, the person who needs to get things done, through the steps from
automation to orchestration. With an easy to use set of API's and examples, you should be up and running and seeing
results, before you completely understand all ins and outs of the project. The Workflow Orchestrator enables you to
define products to which users can subscribe, and helps you intelligently manage the lifecycle, with the use of
**Creation**, **Modification**, **Termination** and **Validation** workflows, of resources that you provide to your
users.

## What does a workflow look like? It must be pretty complex!

Programming a new workflow should be really easy, and at its core it is. By defining workflows as Python functions,
all you need to do is understand how to write basic python code, the framework will help take care of the rest.

```py
@workflow("Name of the workflow", initial_input_form=input_form_generator)
def workflow():
    return (
        init
        >> arbitrary_step_func_1
        >> arbitrary_step_func_2
        >> arbitrary_step_func_3
        >> done
    )
```

If this has sparked your interest, read more about [the framework](./architecture/framework.md) or jump into
[Getting Started](orchestrator-core/getting-started/base.md).

<!-- TODO's
- Instead of "the framework" link to "at a glance" / "not-a-video Crash course"
- Add an overall "Getting Started" page that links together the backend and frontend
-->

## Tooling

The WFO programme maintains an entire ecosystem of tooling, a non-comprehensive list in no
particular order:

- [Orchestrator-Core](https://github.com/workfloworchestrator/orchestrator-core): This Python
  program leverages the power of FastAPI, Pydantic and SQLAlchemy to create an orchestration engine. Downloads:
  [![pypi-downloads](https://static.pepy.tech/badge/orchestrator-core)](https://pepy.tech/project/orchestrator-core).
- [Orchestrator-UI](https://github.com/workfloworchestrator/orchestrator-ui-library): Component
  library for a modern and flexible NextJS app on top of the Orchestrator-core. Downloads:
  [![npm-downloads](https://img.shields.io/npm/dt/%40orchestrator-ui%2Forchestrator-ui-components)](https://github.com/workfloworchestrator/orchestrator-ui-library).
- [Orchestrator Example UI](https://github.com/workfloworchestrator/example-orchestrator-ui/):
  Example UI with a NextJS implementation of our component library.
- [LSO](lightweight-service-orchestrator/index.md): This application provides an API layer on top of
  Ansible playbooks. Downloads:
  [![pypi-downloads](https://static.pepy.tech/badge/orchestrator-lso)](https://pepy.tech/project/orchestrator-lso).
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

## Which organizations are using Workflow Orchestrator?

[<img alt='SURF' src='/img/surf-logo.png' style="margin-right: 50px; margin-bottom: 50px;">](https://surf.nl)
[<img alt='ESnet' src='/img/esnet-logo.png' style="margin-right: 50px; margin-bottom: 50px;">](https://es.net)
[<img alt='GÉANT' src='/img/geant-logo.png' style="margin-right: 50px; margin-bottom: 50px;">](https://geant.org)
[<img alt='HEAnet' src='/img/HEAnet-Logo.png' style="margin-right: 50px; margin-bottom: 50px;">](https://www.heanet.ie/)
[<img alt='Nomios' src='/img/nomios-logo.png' style="margin-right: 50px; margin-bottom: 50px;">](https://www.nomios.com/)
[<img alt='ShopVirge' src='/img/ShopVirge-logo.png' style="margin-right: 50px; margin-bottom: 50px;">](https://shopvirge.com)
[<img alt='CANARIE' src='/img/CANARIE_small.png' style="margin-right: 50px; margin-bottom: 50px;">](https://canarie.ca)
[<img alt='GARR' src='/img/Logo-GARR-small.png' style="margin-right: 50px; margin-bottom: 50px;">](https://garr.it)
[<img alt='REANNZ' src='/img/reannz-logo-small.png' style="margin-right: 50px; margin-bottom: 50px;">](https://reannz.co.nz)
[<img alt='Internet2' src='/img/internet2-logo.svg' style="margin-right: 50px; margin-bottom: 50px; height: 130px;">](https://internet2.edu)

</div>
