class MinHeap {
  constructor() {
    this.heap = [];
  }

  get size() {
    return this.heap.length;
  }

  push(node, priority) {
    this.heap.push({ node, priority });
    this._bubbleUp(this.heap.length - 1);
  }

  pop() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this._bubbleDown(0);
    return top;
  }

  _bubbleUp(idx) {
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      if (this.heap[idx].priority >= this.heap[parentIdx].priority) break;
      [this.heap[idx], this.heap[parentIdx]] = [this.heap[parentIdx], this.heap[idx]];
      idx = parentIdx;
    }
  }

  _bubbleDown(idx) {
    const length = this.heap.length;
    while (true) {
      let smallest = idx;
      const left = 2 * idx + 1;
      const right = 2 * idx + 2;

      if (left < length && this.heap[left].priority < this.heap[smallest].priority) smallest = left;
      if (right < length && this.heap[right].priority < this.heap[smallest].priority) smallest = right;

      if (smallest === idx) break;
      [this.heap[idx], this.heap[smallest]] = [this.heap[smallest], this.heap[idx]];
      idx = smallest;
    }
  }
}

class Dijkstra {
  findShortestPath(graph, start, end) {
    const distances = {};
    const visited = new Set();
    const previous = {};

    for (const node of Object.keys(graph)) {
      distances[node] = Infinity;
    }
    distances[start] = 0;

    if (!(end in distances)) {
      distances[end] = Infinity;
    }

    const pq = new MinHeap();
    pq.push(start, 0);

    let iterations = 0;
    let relaxations = 0;

    while (pq.size > 0) {
      iterations++;
      const { node: current, priority: currentDist } = pq.pop();

      if (visited.has(current)) {
        continue;
      }
      visited.add(current);

      if (current === end) {
        break;
      }

      // Stale entry check — a better distance was already processed
      if (currentDist > distances[current]) {
        continue;
      }

      const neighbors = graph[current] || [];

      for (const neighbor of neighbors) {
        relaxations++;
        const newDist = distances[current] + neighbor.weight;

        if (newDist < (distances[neighbor.node] || Infinity)) {
          distances[neighbor.node] = newDist;
          previous[neighbor.node] = current;
          pq.push(neighbor.node, newDist);
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
