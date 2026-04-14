# WorkflowOrchestrator.org website
This is the website of the workflow orchestrator programme.

The webpage is built using mkdocs

### Developing
You need uv to run this, take a look at [this](https://docs.astral.sh/uv/getting-started/installation/) to install it. Once you have it , to edit do the following :

```bash
uv run mkdocs serve
```

> [!NOTE]
> This Mkdocs setup implements multirepo, and expectes other repositories to be present. The expected repos are listed in the mkdocs.yml config file. Comment out these parts if you dont need them. Otherwise you can clone everything you need with: ```  git clone `grep INCLUDED_REPO mkdocs.yml | awk '{print $3}'` ```

You can add menu items in the `mkdocs.yml` file. Content is added by changing the files in the `docs/` directory.

If it does not work, you might need to set the following in your ENV:

```bash
export DYLD_FALLBACK_LIBRARY_PATH=/opt/homebrew/lib
```

For more advanced options in MKdocs check the documentation of the theme [here](https://squidfunk.github.io/mkdocs-material/getting-started/)

### Publishing
```bash
mkdocs gh-deploy --config-file mkdocs.yml --remote-branch master
```

