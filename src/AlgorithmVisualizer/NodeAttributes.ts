/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO - Add a class to handle NodeAttributes remove location optional
export interface INodeAttributes {
  location: { row: number, col: number }
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isShortestPath: boolean;
  isPath: boolean;
  isWeight: boolean;
  isWeighted: boolean;
}

export const AssociatedCSSClass = {
  isStart: 'start',
  isEnd: 'end',
  isWall: 'wall',
  isVisited: 'visited',
  isShortestPath: 'shortest-path',
  isPath: 'path',
  isWeight: 'weight',
  isWeighted: 'weighted',
};

const NodeAttributes = {
  isStart: false,
  isEnd: false,
  isWall: false,
  isVisited: false,
  isShortestPath: false,
  isPath: false,
  isWeight: false,
  isWeighted: false,
};

// [ ] - add as static method to NodeAttributes class once implemented
export function initializeWithLocation(row: number, col: number): INodeAttributes {
  const location = { row, col };
  return { ...NodeAttributes, location };
}

export default NodeAttributes;
