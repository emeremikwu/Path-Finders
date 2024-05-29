import { IGrid, NodeLocation } from '../Grid/grid.types';
import { Algorithm, AlgorithmResult } from './algorithms.types';

function AStar(grid: IGrid): AlgorithmResult {
  const visitedNodes: NodeLocation[] = [];
  const previousNodes = new Map<string, NodeLocation | null>();

  const result: AlgorithmResult = {
    algorithm: Algorithm.aStar,
    visitedNodes,
  };

  return result;
}
