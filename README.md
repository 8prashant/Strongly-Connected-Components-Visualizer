# Strongly Connected Components Visualizer

Welcome to the Strongly Connected Components Visualizer! This web application allows you to explore the structure of directed graphs and visualize their strongly connected components using Tarjan's algorithm.

## Demo

Check out the live demo: [Strongly Connected Components Visualizer](https://spectacular-llama-9ad7a3.netlify.app/)

## Features

- **Interactive Visualization:** Input the number of nodes and edges (comma-separated) to visualize the directed graph.
- **Distinct Colors:** Each strongly connected component is assigned a distinct color for easy identification.
- **Clear and Reset:** Clear the graph and reset input values with a single click.

## Usage

1. Visit the [live demo site](https://spectacular-llama-9ad7a3.netlify.app/).
2. Enter the desired number of nodes and edges in the input fields.
3. Input edges in the format "0-1, 1-2, ..." (comma-separated).
4. Click the "Visualize" button to see the strongly connected components.
5. Use the "Clear" button to reset the graph and input values.

## Technologies Used

- [D3.js](https://d3js.org/): Data visualization library for creating interactive graphs.
- [Netlify](https://www.netlify.com/): Hosting platform for deploying the web application.

## Local Development

If you want to run the project locally:

1. Clone this repository.
2. Open `index.html` in your web browser.
3. Experiment with the visualization by inputting different node and edge values.

## Algorithm: Tarjan's Algorithm for SCC

The Strongly Connected Components (SCCs) are found using Tarjan's algorithm. Here's a brief explanation of the algorithm:

### Initialization:

Each node in the graph is assigned two attributes: `disc` (discovery time) and `low`.
Initially, these attributes are set to -1 for all nodes, indicating that they have not been visited.

### Depth-First Search (DFS):

The algorithm uses a depth-first search (DFS) traversal of the graph.
As the DFS progresses, each node is assigned a unique discovery time (`disc`), representing when it was first encountered in the DFS traversal.

### Stack:

Nodes are maintained in a stack as they are discovered during the DFS.
A node is pushed onto the stack when it is first visited.

### Low Values:

Along with the discovery time, each node is assigned a low value.
The low value of a node represents the earliest node (discovered so far) that can be reached from the subtree rooted at the current node, including itself.

### Identifying Strongly Connected Components:

When a node is popped from the stack, its low value is updated based on the low values of its adjacent nodes.
If the low value of a node is equal to its discovery time (`disc`), it implies that the node is the root of a strongly connected component.
All nodes popped from the stack until the current node form a strongly connected component.

### Algorithm Steps:

1. Start DFS from each unvisited node.
2. During DFS, update `disc` and `low` values, and maintain the stack.
3. When a strongly connected component is identified, mark its nodes accordingly.
4. Continue until all nodes are visited.

### Pseudocode:

```plaintext
function tarjanAlgorithm(graph):
    Initialize empty stack
    Initialize time variable (global)

    for each node in graph:
        if node is not visited:
            performDFS(node)

function performDFS(node):
    Set node.disc and node.low to current time
    Increment current time
    Push node onto the stack
    Mark node as visited

    for each neighbor of node:
        if neighbor is not visited:
            performDFS(neighbor)
            update node.low based on neighbor.low

        else if neighbor is on the stack:
            update node.low based on neighbor.disc

    if node.low is equal to node.disc:
        // Node is the root of a strongly connected component
        Start a new component
        Pop nodes from the stack until the current node is popped
        Mark popped nodes as part of the current strongly connected component
