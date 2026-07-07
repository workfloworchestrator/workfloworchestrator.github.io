To create a new product configuration and wire up the python, database and workflows correctly you need to create a
lot of boilerplate configuration and code. To speed up this process and make the experience as user friendly as
possible, initial configuration of what a product looks like can be created with a yaml file.

At the end of these steps the developer will have all the necessary configuration and boilerplate completed to run
the workflow and start developing on implementing the business logic.

### Step 1 - Create the product configuration file

Open the Example Orchestrator directory and list the templates directory. It should look similar to this:

```shell
❯ ls -l templates
total 32
-rw-r--r--  1 boers001  staff  2687 Mar  7 11:28 core_link.yaml
-rw-r--r--  1 boers001  staff  2052 Mar  7 11:28 l2vpn.yaml
-rw-r--r--  1 boers001  staff  2575 Mar  7 11:28 node.yaml
-rw-r--r--  1 boers001  staff  2444 Mar  7 11:28 port.yaml
```

This directory houses all the configuration of the initial products that the example orchestrator provides. It is a
starting point for developing new products.

Create a new file in the template directory called `l2_p2p.yaml`:

```shell
touch templates/l2_p2p.yaml
```

In this workshop we will generate the L2-Point-to-Point model and workflows by configuring it with this yaml file.

### Step 2 - Configure the YAML

This file will contain the Initial product type configuration. Please create a yaml configuration reflecting the
product model as described on the [previous page](create-your-own.md). The goal is to configure the generator to
reuse as many of the product blocks already existing in the orchestrator as possible.

Take a look at the [`l2vpn.yaml`](https://github.com/workfloworchestrator/example-orchestrator/blob/main/templates/l2vpn.yaml) model for inspiration.
As you can see, this file has been configured in a certain way to reflect the configuration of the product.
For more in depth documentation about `generate` take a look at the [reference
doc](../../orchestrator-core/reference-docs/cli.md#generate).

??? example "Answer - l2_p2p.yaml"
    When creating the YAML you should notice that you do not have to create the **SAP** product blocks again. You just
    have reference the **SAP** in the **Virtual Circuit** configuration. In this way you start reusing existing
    building blocks that already exist in the orchestrator. We cannot reuse the existing Virtual Circuit with the
    generator due to the different limits on the amount of SAPS that can be connected to the Virtual Circuit of the
    L2 P2P product.

    ```yaml
    config:
      summary_forms: true
    name: l2_p2p
    type: L2p2p
    tag: L2P2P
    description: "L2 Point-to-Point"
    fixed_inputs:
      - name: protection_type
        type: enum
        enum_type: str
        values:
          - protected
          - unprotected
        description: "Level of network redundancy"
    product_blocks:
      - name: l2_p2p_virtual_circuit
        type: L2p2pVirtualCircuit
        tag: VC
        description: "virtual circuit product block"
        fields:
          - name: saps
            type: list
            description: "Virtual circuit service access points"
            list_type: SAP
            min_items: 2
            max_items: 2
            required: provisioning
          - name: speed
            description: "speed of the L2VPN in Mbit/s"
            type: int
            required: provisioning
            modifiable:
          - name: speed_policer
            description: "speed policer active?"
            type: bool
            required: provisioning
            modifiable:
          - name: ims_id
            description: "ID of the L2VPN in the inventory management system"
            type: int
            required: active
          - name: nrm_id
            type: int
            description: "ID of the L2VPN in the network resource manager"
            required: active
    ```

### Step 3 - Run the generator functions

To help generate the correct file exec into the running container and activate the Python venv:

```shell
docker compose exec -it orchestrator bash
source .venv/bin/activate
```

!!! danger "What can I do when I encounter errors?"
    If you want to start over, use `git restore .` and `git clean -id` from your example-orchestrator directory to undo changes.

#### Product Blocks

Run the command to generate the domain models product blocks:

```shell
python main.py generate product-blocks -cf templates/l2_p2p.yaml --no-dryrun
```

The `--no-dryrun` option will immediately write the files to the `products/product_blocks` folder and create:
`l2_p2p_sap.py` and `l2_p2p_virtual_circuit.py`. This file contains the product block configuration for the l2-p2p
product and defines the strict hierarchy of virtual circuit and saps.

#### Product

Now create the product.

```shell
python main.py generate product -cf templates/l2_p2p.yaml --no-dryrun
```

This will create the file `products/product_types/l2_p2p.py`. When looking at this file you can see it created the
domain model, fixed inputs and imported the correct product blocks to be used in this subscription.

#### Workflows

Now generate the workflows. This command will always create 4 sets of workflows `create`, `modify`, `terminate` and
`validate`. These can be implemented as the user sees fit.

Run the command:

```shell
python main.py generate workflows -cf templates/l2_p2p.yaml --no-dryrun
```

As you can see this file needs to be run with the --force flag as it needs to overwrite a number of configuration
files. Furthermore it will populate the files in `workflows/l2_p2p/`. Do that now:

```shell
python main.py generate workflows -cf templates/l2_p2p.yaml --no-dryrun --force
```

!!! warning
    There is a [bug](https://github.com/workfloworchestrator/orchestrator-core/issues/1757) in `generate workflows`
    which makes it overwrite the contents of `workflows/shared.py` instead of
    extend it with the missing elements. You can use `git restore` to restore it aftwards.

Take a look around to see which files have been created by now.
Can you explain what each of them are for?

#### Database migrations

As a final step the user must generate and run the migrations to wire up the database. This is done as follows.

```shell
python main.py generate migration -cf templates/l2_p2p.yaml
python main.py db upgrade heads
```

### Step 4 - Profit

If this has been executed without errors, you should see the option **l2_p2p protected** and
**l2_p2p unprotected** appear in the **New subscription** menu, as well as in the Metadata pages.
Select either product, and try to fill in the form. There is a small quirk with one of the fields, which has been
left in as an exercise to understand the interaction between the workflow form and the UI.

Once you submit the form you'll notice that creating the subscription does not work right away, as
the "initial_input_form_generator" still needs to be extended with a field to select Port subscriptions for the SAPs,
and the "construct_l2_p2p_model" step will need to be updated accordingly.
This is out of scope for the workshop.

But this should give you an idea how the generator gives users a head start by setting up a product and workflows according
to the best practices. They can then go into the workflow source code and start implementing steps
to provision the resource that is being created by the create workflow.

### Step 5 - Bonus

Add a new step in the `create_l2_p2p` workflow that manipulates the subscription in a certain way. An example could be
to change the subscription description, or any other value you can think of that exists in the subscription.

??? example "Answer"
    ```python
    @step("Update Subscription Description")
    def update(subscription: L2p2pProvisioning) -> State:
        subscription.description = "My Awesome L2P2P"
        return state | {"subscription": subscription}
    ```
