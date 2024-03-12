# WorkflowOrchestrator.org website
This is the website of the workflow orchestrator programme.

The webpage is built using mkdocs

### Developing
To edit do the following:

```bash
pip install -r requirements.txt
```

```bash
mkdocs serve
```

### Publishing
```bash
mkdocs gh-deploy --config-file mkdocs.yml --remote-branch master
```
