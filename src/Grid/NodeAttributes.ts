/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO - Add a class to handle NodeAttributes remove location optional

export enum NodeType {
  default = 'default',
  start = 'start',
  end = 'end',
  wall = 'wall',
  visited = 'visited',
  shortestPath = 'shortest-path',
  path = 'path',
  weight = 'weight',
  weighted = 'weighted',
}

export interface INodeAttributes {
  type: NodeType;
  visited: boolean;
  weight: number;
}

export function initializeNode(
  type = NodeType.default,
  weight = 1,
  visited = false,
): INodeAttributes {
  return { type, weight, visited };
}
