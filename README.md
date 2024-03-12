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
You can add menu items in the `mkdocs.yml` file. Content is added by changing the files in the `docs/` directory.

For more advanced options in MKdocs check the documentation of the theme [here](https://squidfunk.github.io/mkdocs-material/getting-started/)

### Publishing
```bash
mkdocs gh-deploy --config-file mkdocs.yml --remote-branch master
```
