# WorkflowOrchestrator.org website

This is the website of the Workflow Orchestrator Programme.

The webpage is built using mkdocs.

### Developing

You need uv to run this, take a look at [this](https://docs.astral.sh/uv/getting-started/installation/) to install it.

The project uses pre-commit to enforce YAML and Markdown codestyle, install that with:

```bash
uv run pre-commit install
```

This Mkdocs setup implements monorepo, and expects other repositories to be present.
The expected repos are listed in the mkdocs.yml config file.
Comment out these parts if you dont need them.
Otherwise, you can clone and install everything you need with:

```bash
./setup_subprojects.sh
```

Now you can edit the documentation.

To render the documentation locally, run:

```bash
uv run mkdocs serve
```

### Publishing

Publishing is automated with a GitHub action that runs whenever there is a commit on the main branch.
