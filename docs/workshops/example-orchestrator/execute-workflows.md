The topology in the previous section will be used in the workshop as an example of what a network could look like.
Obviously it is possible to create any "physical" topology you like and build the matching "logical" topology
using the Workflow Orchestrator.

### Putting initial data in place

The first thing we will do is populate Netbox with some initial data such as Manufacturers and Device types,
as well as networks allocated for Loopback and Core-links addressing.

To do this, navigate to the **Tasks** page, click **New task** and then select **Netbox Bootstrap**.
An empty form will show where you can click **Start task**.

Once the workflow has successfully run, we can login into netbox (admin/admin) and check the situation: within the **Devices** menu you can see that the **Device Types** and **Manufacturers** now contain some definitions.

In the **IPAM >> Prefixes** menu we are going to reserve the first address of the loopback networks since certain network devices dont like "network addresses" to be used as loopback addresses.

* From the IPv4 prefix `10.0.127.0/24` we allocate the address `10.0.127.0/32` with status `Reserved` and description `RESERVED`
* From the IPv6 prefix `fc00:0:0:127::/64` we allocate the address `fc00:0:0:127::/128` with status `Reserved` and description `RESERVED`

### Deploying the nodes

Now we should be able to deploy our routers using the `create node` workflow in the Orchestrator.
To do this, click the **New subscription** button and select **node Nokia**.
This is going to create a new subscription of the "node Nokia" product.
We will have to fill an initial form.

* **Customer**: SURF
* **Node type**: Select the first option
* **Node role**: Provider
* **Site**: Amsterdam
* **Node status**: active
* **Node name**: Same as the node name in containerlab: `clab-orch-demo-ams-pe`, `clab-orch-demo-lon-pe` and `clab-orch-demo-par-p`

Click **Next** and, review the summary page, and click **Next** again to start the workflow.

Once the workflow has successfully ran we can login into the node and take a look at the config:

```
ssh clab-orch-demo-ams-pe -l admin
# Enter password: NokiaSrl1!
```

!!! note
    If you deployed containerlab through the docker image, run the ssh commands from the same container.

We can practice this deploying all the 3 nodes in the topology.

### Deploying core links

Once we have 2 nodes configured, we should be able to deploy a core link between them using the "create core link 10G" workflow.

You can login into the router and check the status of ISIS using:

```
show network-instance default protocols isis adjacency
show network-instance default protocols isis interface
```
