class CycleService {
  detectCycle(graph) {
    const visited = new Set();
    const recStack = new Set();
    const path = [];

    const dfs = (node) => {
      if (recStack.has(node)) {
        const cycleStart = path.indexOf(node);
        return path.slice(cycleStart);
      }
      if (visited.has(node)) return null;

      visited.add(node);
      recStack.add(node);
      path.push(node);

      const neighbors = graph[node] || [];
      for (const n of neighbors) {
        const result = dfs(n.node);
        if (result) return result;
      }

      recStack.delete(node);
      path.pop();
      return null;
    };

    for (const node of Object.keys(graph)) {
      if (!visited.has(node)) {
        const cyclePath = dfs(node);
        if (cyclePath) return { hasCycle: true, cyclePath };
      }
    }
    return { hasCycle: false };
  }
}

module.exports = new CycleService();
