import { NodeLocation } from '../Grid/grid.types';

export enum Algorithm {
  dijkstra = 'dijkstra',
  aStar = 'aStar',
  bfs = 'bfs',
  dfs = 'dfs',
}

export interface AlgorithmResult {
  algorithm: Algorithm,
  shortestPath: NodeLocation[],
  distance: number,
  visitedNodes: NodeLocation[],
}
