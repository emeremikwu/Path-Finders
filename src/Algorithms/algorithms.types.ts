import { NodeLocation } from '../Grid/grid.types';

export enum AlgorithmType {
  dijkstra = 'Dijkstra',
  aStar = 'A*',
  // bfs = 'Breath First Search',
  // dfs = 'Depth First Search',
}

export interface AlgorithmResult {
  algorithm: AlgorithmType,
  shortestPath?: NodeLocation[],
  distance?: number,
  visitedNodes: NodeLocation[],
}

// A Star Data Structure

export interface AStarDS {
  f: number;
  g: number;
  h: number;
  location: NodeLocation; // the location of itself
  previousNode: NodeLocation | null;
}

export interface DikstrasDS {
  distance: number;
  location: NodeLocation;
}

export type HeuristicFN = (start: NodeLocation, end: NodeLocation) => number;
