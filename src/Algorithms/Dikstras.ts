import { DefaultNodeLocation } from '../Grid/grid.defaults';
import { IGrid, NodeLocation } from '../Grid/grid.types';
import { getNode } from '../Grid/mutaters';
import { NodeType } from '../Grid/NodeAttributes';
import {
  getAbsoluteLocation, stringifyLocation, stringifyLocationObject,
} from '../Grid/utils';
import { Algorithm, AlgorithmResult } from './algorithms.types';
// TODO - Implement Dikstra's Algorithm
// [ ] - remove unknown and replace with AlgorithmResult

let rowCount: number;
let colCount: number;
const priorityQueueComparator = (
  a: { distance: number },
  b: { distance: number },
) => a.distance - b.distance;

function getNeighbors(grid: IGrid, node: NodeLocation): NodeLocation[] {
  const neighbors: NodeLocation[] = [];

  /*
    not really necessary but insures that a node has a proper location,
    and if we decided to modify how we access a node index we don't have to change much
   */
  const [row, col] = getAbsoluteLocation(grid, node, false);

  if (row > 0) neighbors.push({ ...DefaultNodeLocation, row: row - 1, col });
  if (row < rowCount - 1) neighbors.push({ ...DefaultNodeLocation, row: row + 1, col });
  if (col > 0) neighbors.push({ ...DefaultNodeLocation, row, col: col - 1 });
  if (col < colCount - 1) neighbors.push({ ...DefaultNodeLocation, row, col: col + 1 });

  return neighbors;
}

/**
 * Priority Queue(min heap) based implementation for Dikstra's Algorithm
 * @param grid
 * @param startLocation
 * @param endLocation
 * @returns AlgorithmResult - shortest path, distance, visited nodes, ordered visited nodes
 */
export function dikstras(
  grid: IGrid,
  startLocation: NodeLocation,
  endLocation: NodeLocation,
): AlgorithmResult {
  // if(!nodeIsRegistered(grid, startLocation) || !nodeIsRegistered(grid, endLocation)) {}
  if (!startLocation || !endLocation) throw new Error('Invalid start or end location');
  if (startLocation === endLocation) throw new Error('Start and end location cannot be the same');

  const result: AlgorithmResult = { algorithm: Algorithm.dijkstra } as AlgorithmResult;
  const visitedNodes = new Set<string>();
  const visitedNodesOrdered: NodeLocation[] = []; // this is for visualization
  const previousNode = new Map<string, NodeLocation | null>();
  const distances = new Map<string, number>(); // distance from start node
  const priorityQueue: { location: NodeLocation, distance: number }[] = [];

  [rowCount, colCount] = [grid.nodes.length, grid.nodes[0].length];

  const [startNodeRow, startNodeCol] = getAbsoluteLocation(grid, startLocation);

  // Initialize distances and previous maps
  for (let row = 0; row < rowCount; row += 1) {
    for (let col = 0; col < colCount; col += 1) {
      // unvisitedNodes.add(stringifyLocation(row, col));
      distances.set(stringifyLocation(row, col), Infinity);
      previousNode.set(stringifyLocation(row, col), null);
    }
  }
  // set the first node distance to zero
  distances.set(stringifyLocation(startNodeRow, startNodeCol), 0);
  priorityQueue.push({ location: startLocation, distance: 0 });

  while (priorityQueue.length > 0) {
    priorityQueue.sort(priorityQueueComparator);
    const currentNode = priorityQueue.shift()!;
    const currentNodeKey = stringifyLocationObject(currentNode.location);

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
      result.distance = distances.get(stringifyLocationObject(endLocation)) ?? 0;
      result.visitedNodes = visitedNodesOrdered;
      break;
    }

    getNeighbors(grid, currentNode.location).forEach((neighborLocation: NodeLocation) => {
      const neighborKey = stringifyLocationObject(neighborLocation);
      const neighborNode = getNode(grid, neighborLocation)!;
      if (visitedNodes.has(neighborKey) || neighborNode.type === NodeType.wall) return;
      visitedNodes.add(neighborKey);
      visitedNodesOrdered.push(neighborLocation);

      const currentDistance = distances.get(currentNodeKey);
      const neighborDistance = neighborNode.weight ?? 1;
      const tentativeDistance = currentDistance! + neighborDistance;
      console.log(`CurrentD: ${currentNodeKey}, NeighborD: ${neighborKey}, TentativeD: ${tentativeDistance}`);

      if (tentativeDistance < neighborDistance) {
        priorityQueue.push({ location: neighborLocation, distance: tentativeDistance });
        previousNode.set(neighborKey, currentNode.location);
        distances.set(neighborKey, tentativeDistance);
      }
    });
  }

  return result;
}

export default dikstras;
