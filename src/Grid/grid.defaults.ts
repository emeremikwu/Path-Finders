import { IGrid, NodeLocation } from './grid.types';

export const DefaultNodeLocation: NodeLocation = {
  row: -1,
  col: -1,
  startFromOne: false,
  reverseRowIndex: false,
};

export const DefaultGridObject: IGrid = {
  nodes: [],
  shape: [0, 0],
  endpoints: [undefined, undefined],
  startNodeSet: false,
  endNodeSet: false,
  nodeRegistry: [],
  /* heuristics: [1, 1, 0], */

};
