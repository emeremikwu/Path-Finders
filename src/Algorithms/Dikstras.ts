import { IGrid, NodeLocation } from '../Grid/grid.types';
import { getNode } from '../Grid/mutaters';
import { NodeType } from '../Grid/NodeAttributes';
import {
  stringifyLocation, stringifyLocationObject,
} from '../Grid/utils';
import { Algorithm, AlgorithmResult } from './algorithms.types';
import { getNeighbors } from './utils';
// TODO - Implement Dikstra's Algorithm
// [ ] - remove unknown and replace with AlgorithmResult

let rowCount: number;
let colCount: number;
const priorityQueueComparator = (
  a: { distance: number },
  b: { distance: number },
) => a.distance - b.distance;

/**
 * Priority Queue(min heap) based implementation for Dikstra's Algorithm
 * @param grid
 * @param startLocation
 * @param endLocation
 * @returns AlgorithmResult - shortest path, distance, visited nodes, ordered visited nodes
 */
export async function dikstras(grid: IGrid): Promise<AlgorithmResult | null> {
  if (!grid.endpoints[0] || !grid.endpoints[1]) throw new Error('Start and end nodes must be set');
  // if ( === ) throw new Error('Start and end location cannot be the same');
  if (stringifyLocationObject(grid.endpoints[0]) === stringifyLocationObject(grid.endpoints[1])) throw new Error('Start and end location cannot be the same');

  const [startLocation, endLocation] = grid.endpoints;
  // const result: AlgorithmResult = {};

  const visitedNodes = new Set<string>();
  const visitedNodesOrdered: NodeLocation[] = []; // this is for visualization
  const previousNode = new Map<string, NodeLocation | null>();
  const distances = new Map<string, number>(); // distance from start node
  const priorityQueue: { location: NodeLocation, distance: number }[] = [];

  [rowCount, colCount] = [grid.nodes.length, grid.nodes[0].length];

  // prepare the result object
  const result: AlgorithmResult = {
    algorithm: Algorithm.dijkstra,
    visitedNodes: visitedNodesOrdered,
  };

  // Initialize distances and previous maps
  for (let row = 0; row < rowCount; row += 1) {
    for (let col = 0; col < colCount; col += 1) {
      distances.set(stringifyLocation(row, col), Infinity);
      previousNode.set(stringifyLocation(row, col), null);
    }
  }

  // set the first node distance to zero
  distances.set(stringifyLocationObject(startLocation), 0);
  priorityQueue.push({ location: startLocation, distance: 0 });

  while (priorityQueue.length > 0) {
    priorityQueue.sort(priorityQueueComparator);
    const currentNode = priorityQueue.shift()!;
    const currentNodeKey = stringifyLocationObject(currentNode.location);
    const currentNodeDist = distances.get(currentNodeKey)!;

    // eslint-disable-next-line no-continue
    if (visitedNodes.has(currentNodeKey)) continue;
    visitedNodes.add(currentNodeKey);
    visitedNodesOrdered.push(currentNode.location);

    // if we reached the end location, stop and reconstruct the path
    if (currentNodeKey === stringifyLocationObject(endLocation)) {
      const path: NodeLocation[] = [];
      path.unshift(currentNode.location);
      // set the current node as the end location
      let curr: NodeLocation | null = endLocation;

      // work backwards until null(start node should have a null previous node)
      while (curr) {
        path.unshift(curr);
        curr = previousNode.get(stringifyLocationObject(curr))!;
      }
      result.shortestPath = path;

      break;
    }

    // give event loop a chance to do other things
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => { setTimeout(resolve, 0); });

    const neighbors = getNeighbors(grid, currentNode.location);
    // get neighbors of the current node
    neighbors.forEach((neighborLocation: NodeLocation) => {
      const neighborKey = stringifyLocationObject(neighborLocation);
      const neighborNode = getNode(grid, neighborLocation)!;

      if (neighborNode.type === NodeType.wall) return;
      if (visitedNodes.has(neighborKey)) return;

      const tentative = currentNodeDist + neighborNode.weight;
      if (tentative < distances.get(neighborKey)!) {
        distances.set(neighborKey, tentative);
        previousNode.set(neighborKey, currentNode.location);
        priorityQueue.push({ location: neighborLocation, distance: tentative });
      }
    });
  }

  result.distance = distances.get(stringifyLocationObject(endLocation)) ?? Infinity;
  result.shortestPath = result.shortestPath ?? [];

  return result;
}

export default dikstras;
