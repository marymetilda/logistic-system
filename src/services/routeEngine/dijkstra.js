class Dijkstra {
  findShortestPath(graph, start, end) {
    const distances = {};
    const visited = new Set();
    const previous = {};

    const nodes = Object.keys(graph);

    for (const node of nodes) {
      distances[node] = Infinity;
    }

    distances[start] = 0;

    while (nodes.length) {
      nodes.sort((a, b) => distances[a] - distances[b]);

      const current = nodes.shift();

      if (!current) break;
      if (visited.has(current)) continue;

      visited.add(current);

      const neighbors = graph[current] || [];

      for (const neighbor of neighbors) {
        const newDist = distances[current] + neighbor.weight;

        if (newDist < (distances[neighbor.node] || Infinity)) {
          distances[neighbor.node] = newDist;
          previous[neighbor.node] = current;
        }
      }
    }
    const path = [];
    let current = end;

    while (current) {
      path.unshift(current);
      current = previous[current];
    }

    return {
      path,
      totalCost: distances[end],
    };
  }
}

module.exports = new Dijkstra();
