/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { MouseEvent, useContext, useEffect } from 'react';
import { GridContext, IGridContext } from '../Grid/useGrid';
import { INodeAttributes, NodeType } from '../Grid/NodeAttributes';

import './DevBar.css';
import Grid from '../Grid/Grid';

function printDebugInfo(grid: Grid): void {
  const dimensions = grid.shape;
  const startSet: boolean = grid.startNodeSet;
  const endSet: boolean = grid.endNodeSet;

  const endpoints = grid.findEndpoints();

  console.log(`Grid Dimensions: ${dimensions[0]}x${dimensions[1]}`);
  console.log(`Start Node Set: ${startSet} Location: ${startSet ? `${endpoints[0]?.row}x${endpoints[0]?.col}` : ''}`);
  console.log(`End Node Set: ${endSet} Location: ${endSet ? `${endpoints[1]?.row}x${endpoints[1]?.col}` : ''}`);
  console.log(`Node Count: ${grid.nodeRegistry.length}`);
}

function setEndpoints(event: MouseEvent<HTMLButtonElement>, dispach: React.Dispatch<React.SetStateAction<Grid>>): void {
  const target = event.target as HTMLButtonElement;
  target.disabled = true;

  let centerRow: number;
  let y1: number;
  let y2: number;

  const modifiedNodes: INodeAttributes[] = [];

  dispach((prev) => {
    centerRow = Math.floor(prev.nodes.length / 2);
    const colLength = prev.nodes[0].length;

    y1 = Math.floor(colLength / 3) - 1;
    y2 = (Math.floor((colLength * 2) / 3));

    const startNode = prev.nodes[centerRow][y1];
    const endNode = prev.nodes[centerRow][y2];

    startNode.type = NodeType.start;
    endNode.type = NodeType.end;

    modifiedNodes.push(startNode, endNode);

    return prev;
  });

  console.log(`Start Node: ${centerRow!}:${y1!}`);
  console.log(`End Node: ${centerRow!}:${y2!}`);
}

function breakpoint(grid): void {
  // eslint-disable-next-line no-debugger
  debugger;
}

function DevBar() {
  const GridContextObject = useContext<IGridContext | null>(GridContext);

  if (!GridContextObject) {
    throw new Error('GridContext is null');
  }

  const { grid, setGrid: dispatchFunction } = GridContextObject;

  useEffect(() => {
    console.log('Object modified');
  }, [grid]);
  return (
    <div className="node-dev-tools">
      <div className="background-text glow">Dev Tools</div>
      <button className="dev-button" type="button" id="10" onClick={() => { printDebugInfo(grid); }}>Print Debug Info</button>
      <button className="dev-button" type="button" id="20" onClick={(e) => { setEndpoints(e, dispatchFunction); }}>Set Endpionts </button>
      <button className="dev-button" type="button" id="30" onClick={() => { breakpoint(grid); }}>Breakpoint</button>
      {/* <button type="button" onClick={() => { renderGridDimensions(gridNodes); }}>Render Grid Dimensions</button> */}
    </div>
  );
}

export default DevBar;
