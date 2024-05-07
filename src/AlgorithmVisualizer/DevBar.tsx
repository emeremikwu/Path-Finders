/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { PropsWithChildren, MouseEvent } from 'react';
import { GridState } from './useGrid';
import { INodeAttributes } from './NodeAttributes';

import './DevBar.css';

interface DevBarProps {
  gridAccess: {
    gridNodes: GridState,
    dispatchFunction: React.Dispatch<React.SetStateAction<GridState>>
  };
}

function printDebugInfo(gridState: GridState): void {
  console.log(`Grid Dimensions: ${gridState.length}x${gridState[0].length}`);
}

function setEndpoints(event: MouseEvent, dispach: React.Dispatch<React.SetStateAction<GridState>>): void {
  const modifiedNodes: INodeAttributes[] = [];
  dispach((prev) => {
    const newGridState: GridState = [...prev];
    const centerRow = Math.floor(prev.length / 2);
    const colLength = prev[0].length;

    const y1 = Math.floor(colLength / 3) - 1;
    const y2 = (Math.floor((colLength * 2) / 3));

    const startNode = newGridState[centerRow][y1];
    const endNode = newGridState[centerRow][y2];

    startNode.isStart = true;
    endNode.isEnd = true;

    modifiedNodes.push(startNode, endNode);

    return newGridState;
  });

  console.log(`Start Node: ${modifiedNodes[0].location.row}:${modifiedNodes[0].location.col}`);
  console.log(`End Node: ${modifiedNodes[1].location.row}:${modifiedNodes[1].location.col}`);
}

function DevBar({ gridAccess }: PropsWithChildren<DevBarProps>) {
  const { dispatchFunction } = gridAccess;

  // TODO: disable button on click;
  // const buttons = document.querySelectorAll('div > button[id][type="button"]');

  return (
    <div className="node-dev-tools">
      <div className="background-text glow">Dev Tools</div>
      <button type="button" id="10" onClick={() => { printDebugInfo(gridAccess.gridNodes); }}>Print Debug Info</button>
      {/* // [ ] - pressing this twice crashes, fix */}
      <button type="button" id="20" onClick={(e) => { setEndpoints(e, dispatchFunction); }}>Set Endpionts </button>

      {/* <button type="button" onClick={() => { renderGridDimensions(gridNodes); }}>Render Grid Dimensions</button> */}
    </div>
  );
}

export default DevBar;
