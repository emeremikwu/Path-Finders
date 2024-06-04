import { Comparator, Heap } from 'heap-js';
import { IGrid, NodeLocation } from '../Grid/grid.types';
import { stringifyLocationObject } from '../Grid/utils';
import {
  Algorithm, AlgorithmResult, AStarDS,
} from './algorithms.types';
import { getNeighbors } from './utils';
import { NodeType } from '../Grid/NodeAttributes';
import { getNode } from '../Grid/mutaters';
import { diagonalDistance, manhattanDistance } from './heuristics';
import { DefaultNodeLocation } from '../Grid/grid.defaults';

const defaultAStarDS: Omit<AStarDS, 'location'> = {
  f: Infinity,
  g: Infinity,
  h: Infinity,
  previousNode: null,
};

function tracePath(nodeDetailsGrid: AStarDS[][], destinationNode: AStarDS): NodeLocation[] {
  const path: NodeLocation[] = [];
  let currentNode = destinationNode;
  while (currentNode.previousNode) {
    path.push(currentNode.location);
    const { row: pRow, col: pCol } = currentNode.previousNode;
    currentNode = nodeDetailsGrid[pRow][pCol];
  }

  return path;
}

// min heap
const AStarPriorityComparator: Comparator<AStarDS> = (a, b) => a.f - b.f;

async function AStar(grid: IGrid, diagonalMovement = false): Promise<AlgorithmResult> {
  const [rows, cols] = grid.shape;
  const orderedVisitedNodes: NodeLocation[] = [];
  const [startLocation, endLocation] = grid.endpoints;
  if (!startLocation || !endLocation) throw new Error('Start and end nodes must be set');
  const endNodeKey = stringifyLocationObject(endLocation);

  /* const nodeDetials: AStarDS[][] = Array.from({ length: rows }, () => Array
    .from<unknown, AStarDS>({ length: cols }, () => ({
    f: Infinity, g: Infinity, h: Infinity, previousNode: null,
  })));

  const closeList: boolean[][] = Array
    .from({ length: rows }, () => Array.from({ length: cols }, () => false));
  const openList = new Heap<AStarDS>(AStarPriorityComparator); */

  const nodeDetails: AStarDS[][] = new Array(rows) as AStarDS[][];
  const closedList: boolean[][] = new Array(rows) as boolean[][];
  const openList = new Heap<AStarDS>(AStarPriorityComparator);

  /* this approach differs from the commented out code above by initializing
      the nodeDetails and closeList in one loop rather than two. Although I'm not sure if
      the performance difference is significant enough to warrant the change.
  */
  for (let row = 0; row < rows; row += 1) {
    nodeDetails[row] = new Array(cols) as AStarDS[];
    closedList[row] = new Array(cols) as boolean[];
    for (let col = 0; col < cols; col += 1) {
      nodeDetails[row][col] = {
        ...defaultAStarDS,
        location: { ...DefaultNodeLocation, row, col },
      };
      closedList[row][col] = false;
    }
  }

  const results: AlgorithmResult = {
    algorithm: Algorithm.aStar,
    visitedNodes: orderedVisitedNodes,
  };

  const startNodeDetails = nodeDetails[startLocation.row][startLocation.col];
  startNodeDetails.f = 0.0;
  startNodeDetails.g = 0.0;
  startNodeDetails.h = 0.0;
  startNodeDetails.previousNode = null;

  openList.push(startNodeDetails);
  // start of algorithm
  while (!openList.isEmpty()) {
    // eslint-disable-next-line no-await-in-loop
    const currentNode = openList.pop()!;
    const { row, col } = currentNode.location;
    closedList[row][col] = true;
    orderedVisitedNodes.push(currentNode.location);

    // if the node is the end node, break the loop
    if (stringifyLocationObject(currentNode.location) === endNodeKey) {
      results.shortestPath = tracePath(nodeDetails, currentNode);
      results.distance = currentNode.g;
      break;
    }

    // give event loop a chance to do other things
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => { setTimeout(resolve, 0); });

    const neighbors = getNeighbors(grid, currentNode.location, diagonalMovement);
    neighbors.forEach((neighbor) => {
      const { row: neighborRow, col: neighborCol } = neighbor;
      const neighborNode = getNode(grid, neighbor)!;
      const neighborNodeDetails = nodeDetails[neighborRow][neighborCol];

      // if the node is already in the closed list(visited), skip it
      if (closedList[neighborRow][neighborCol]) return;
      // if the node is a wall, skip it
      if (neighborNode?.type === NodeType.wall) return;
      // if destination node has already been found, skip the rest of the loop

      const heuristicCB = diagonalMovement ? diagonalDistance : manhattanDistance;
      const gScore = currentNode.g + neighborNode.weight;
      const hScore = heuristicCB(neighbor, endLocation);
      const fScore = gScore + hScore;

      if (fScore < neighborNodeDetails.f) {
        neighborNodeDetails.f = fScore;
        neighborNodeDetails.g = gScore;
        neighborNodeDetails.h = hScore;
        neighborNodeDetails.previousNode = currentNode.location;

        openList.push(neighborNodeDetails);
      }
    });
  }

  /* const result: AlgorithmResult = {
    algorithm: Algorithm.aStar,
    visitedNodes,
  }; */

  return results;
}

export default AStar;
