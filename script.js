let graphSimulation;

function visualizeGraph() {
    const nodeCount = parseInt(document.getElementById("nodeCount").value, 10);
    const edgesInput = document.getElementById("edges").value;

    // Validate user input
    if (isNaN(nodeCount) || nodeCount <= 0) {
        alert("Please enter a valid number of nodes.");
        return;
    }

    if (!edgesInput.trim()) {
        alert("Please enter edges in the format '0-1, 1-2, ...'");
        return;
    }

    const edgesArray = edgesInput.split(",").map(pair => {
        const [source, target] = pair.split("-").map(node => node.trim());
        return { source, target };
    });

    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
        id: i.toString(),
        name: i.toString(),
        low: -1,
        disc: -1,
        onStack: false,
        adjList: [],
    }));

    // Construct the adjacency list
    edgesArray.forEach(edge => {
        const { source, target } = edge;
        nodes[source].adjList.push(target);
    });

    const graph = { nodes, edges: edgesArray };
    const stronglyConnectedComponents = tarjanAlgorithm(graph);

    visualizeDirectedGraph(graph, stronglyConnectedComponents);
}

function visualizeDirectedGraph(graph, stronglyConnectedComponents) {
    const width = 1500;
    const height = 400;

    // Clear previous visualization
    d3.select("#graph-container").selectAll("*").remove();

    const svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    graphSimulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id))
        .force("charge", d3.forceManyBody().strength(-400))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(graph.edges)
        .enter().append("line");

    const node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(graph.nodes)
        .enter().append("circle")
        .attr("r", 20) // Increase the radius to 15 (adjust as needed)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    // Node labels
    svg.append("g")
        .attr("class", "node-labels")
        .selectAll("text")
        .data(graph.nodes)
        .enter().append("text")
        .attr("text-anchor", "middle")
        .text(d => d.name);

    graphSimulation
        .nodes(graph.nodes)
        .on("tick", ticked);

    graphSimulation.force("link")
        .links(graph.edges);

    // Assign colors to strongly connected components
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    node.attr("fill", d => colorScale(stronglyConnectedComponents[d.id]));

    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        // Update node labels
        svg.selectAll(".node-labels text")
            .attr("x", d => d.x)
            .attr("y", d => d.y + 6); // Adjust the vertical position of labels
    }

    function dragstarted(event, d) {
        if (!event.active) graphSimulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) graphSimulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}

function clearGraph() {
    // Clear input fields
    document.getElementById("nodeCount").value = "";
    document.getElementById("edges").value = "";

    // Clear graph visualization
    d3.select("#graph-container").selectAll("*").remove();

    // Stop the simulation if it's running
    if (graphSimulation) {
        graphSimulation.stop();
    }
}

function tarjanAlgorithm(graph) {
    const stack = [];
    const result = [];
    let time = 0;

    const dfs = (node) => {
        node.low = node.disc = time++;
        stack.push(node);
        node.onStack = true;

        for (const neighborId of node.adjList) {
            const neighbor = graph.nodes[neighborId];
            if (neighbor.disc === -1) {
                dfs(neighbor);
                node.low = Math.min(node.low, neighbor.low);
            } else if (neighbor.onStack) {
                node.low = Math.min(node.low, neighbor.disc);
            }
        }

        if (node.low === node.disc) {
            const component = [];
            let poppedNode = null;
            do {
                poppedNode = stack.pop();
                poppedNode.onStack = false;
                component.push(poppedNode.id);
            } while (poppedNode !== node);
            result.push(component);
        }
    };

    for (const node of graph.nodes) {
        if (node.disc === -1) {
            dfs(node);
        }
    }

    // Assign component numbers to each node
    const componentMap = {};
    result.forEach((component, index) => {
        component.forEach(nodeId => {
            componentMap[nodeId] = index;
        });
    });

    return componentMap;
}
