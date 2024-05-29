import { NodeLocation } from '../Grid/grid.types';

export enum Algorithm {
  dijkstra = 'Dijkstra',
  aStar = 'A*',
  bfs = 'Breath First Search',
  dfs = 'Depth First Search',
}

export interface AlgorithmResult {
  algorithm: Algorithm,
  shortestPath?: NodeLocation[],
  distance?: number,
  visitedNodes: NodeLocation[],
}
