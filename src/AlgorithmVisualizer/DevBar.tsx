/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { MouseEvent, useContext, useEffect } from 'react';
import { GridContext } from '../Grid/GridProvider';
import { NodeType } from '../Grid/NodeAttributes';
import { IGrid, NodeRegistryEntry } from '../Grid/grid.types';
import { findEndpoints, getAbsoluteLocation, stringifyLocationObject } from '../Grid/utils';

import './DevBar.css';
import { useAlgorithm } from '../Algorithms';
import { setNode } from '../Grid/mutaters';

function printDebugInfo(grid: IGrid): void {
  const dimensions = grid.shape;
  const startSet: boolean = grid.startNodeSet;
  const endSet: boolean = grid.endNodeSet;

  const endpoints = findEndpoints(grid);

  console.log(`Grid Dimensions: ${dimensions[0]}x${dimensions[1]}`);
  console.log(`Start Node Set: ${startSet} Location: ${startSet ? `${endpoints[0]?.row}x${endpoints[0]?.col}` : ''}`);
  console.log(`End Node Set: ${endSet} Location: ${endSet ? `${endpoints[1]?.row}x${endpoints[1]?.col}` : ''}`);
  console.log(`Node Count: ${grid.nodeRegistry.length}`);
}

/* let centerRow: number;
let y1: number;
let y2: number; */

/* function setEndpoints(event: MouseEvent<HTMLButtonElement>, dispach: React.Dispatch<React.SetStateAction<IGrid>>): void {
  const target = event.target as HTMLButtonElement;
  target.disabled = true;

  const modifiedNodes: NodeRegistryEntry[] = [];

  dispach((prev) => {
    const newGrid = { ...prev };
    centerRow = Math.floor(newGrid.nodes.length / 2);
    const colLength = newGrid.nodes[0].length;

    y1 = Math.floor(colLength / 3) - 1;
    y2 = (Math.floor((colLength * 2) / 3));

    // const startNode = newGrid.nodes[centerRow][y1];
    // const endNode = newGrid.nodes[centerRow][y2];
    // startNode.type = NodeType.start;
    // endNode.type = NodeType.end;

    modifiedNodes.push(setNode(newGrid, { row: centerRow, col: y1, startFromOne: true }, { type: NodeType.start }));
    modifiedNodes.push(setNode(newGrid, { row: centerRow, col: y2, startFromOne: true }, { type: NodeType.end }));

    return newGrid;
  });

  modifiedNodes.forEach((node) => {
    console.log(`Node: ${node.location.row}:${node.location.col} Type: ${node.node.type}`);
  });
} */

function setRandomEndpoints(event: MouseEvent<HTMLButtonElement>, dispach: React.Dispatch<React.SetStateAction<IGrid>>): void {
  const target = event.target as HTMLButtonElement;
  target.disabled = true;

  const modifiedNodes: NodeRegistryEntry[] = [];

  dispach((prev) => {
    const newGrid = { ...prev };
    const [rows, cols] = [newGrid.nodes.length, newGrid.nodes[0].length];

    const [x0, y0] = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
    const [x1, y1] = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];

    modifiedNodes.push(setNode(newGrid, { row: x0, col: y0, startFromOne: false }, { type: NodeType.start }));
    modifiedNodes.push(setNode(newGrid, { row: x1, col: y1, startFromOne: false }, { type: NodeType.end }));

    return newGrid;
  });

  modifiedNodes.forEach((node) => {
    console.log(`Node: ${stringifyLocationObject(node.location)} Type: ${node.node.type}`);
  });
}

function setRandomWeights(event: MouseEvent<HTMLButtonElement>, dispach: React.Dispatch<React.SetStateAction<IGrid>>): void {
  const target = event.target as HTMLButtonElement;
  target.disabled = true;

  dispach((prev) => {
    const newGrid = { ...prev };
    const [rows, cols] = [newGrid.nodes.length, newGrid.nodes[0].length];

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        const node = newGrid.nodes[i][j];
        if (node.type !== NodeType.start && node.type !== NodeType.end) {
          node.weight = Math.floor(Math.random() * 10) + 1;
        }
      }
    }

    return newGrid;
  });
}

function breakpoint(grid: IGrid): void {
  console.log('breakpoint', grid);
  // eslint-disable-next-line no-debugger
  debugger;
}

function DevBar() {
  const { grid, setGrid: dispatchFunction } = useContext(GridContext);

  const {
    isRunning, runAlgorithm, results,
  } = useAlgorithm(grid);

  useEffect(() => {
    if (results) console.log(results);
  }, [results]);

  const runDikstras = async () => {
    await runAlgorithm();
  };

  // useEffect(() => {
  //   if (results) {
  //     grid;
  //     debugger;
  //   }
  // }, [grid]);

  useEffect(() => {
    dispatchFunction((prev) => {
      const newGrid = { ...prev };
      if (results) {
        results.visitedNodes.forEach((location) => {
          const [row, col] = getAbsoluteLocation(newGrid, location, true);
          const currentNode = newGrid.nodes[row][col];
          if (currentNode.type !== NodeType.start && currentNode.type !== NodeType.end) {
            currentNode.type = NodeType.visited;
          }
        });

        if (results.shortestPath) {
          results.shortestPath.forEach((location) => {
            const [row, col] = getAbsoluteLocation(newGrid, location, true);
            const currentNode = newGrid.nodes[row][col];
            if (currentNode.type !== NodeType.start && currentNode.type !== NodeType.end) {
              currentNode.type = NodeType.shortestPath;
            }
          });
        }
      }

      return newGrid;
    });
  }, [dispatchFunction, results]);

  return (
    <div className="node-dev-tools">
      <div className="background-text glow">Dev Tools</div>
      <button className="dev-button" type="button" id="10" onClick={() => { printDebugInfo(grid); }}>Print Debug Info</button>
      {/* <button className="dev-button" type="button" id="20" onClick={(e) => { setEndpoints(e, dispatchFunction); }}>Set Endpoints </button> */}
      <button className="dev-button" type="button" id="20" onClick={(e) => { setRandomEndpoints(e, dispatchFunction); }}>Set Random Endpoints </button>
      <button className="dev-button" type="button" id="30" onClick={(e) => { setRandomWeights(e, dispatchFunction); }}>Set Random Weights</button>
      <button className="dev-button" type="button" id="30" onClick={() => { breakpoint(grid); }}>Breakpoint</button>
      {/* eslint-disable-next-line @typescript-eslint/no-floating-promises */}
      <button className="dev-button" type="button" onClick={() => { runDikstras(); }} disabled={isRunning}>
        {isRunning ? 'Running' : 'Run'}
        {' Dikstras'}
      </button>
      {/* <button type="button" onClick={() => { renderGridDimensions(gridNodes); }}>Render Grid Dimensions</button> */}
    </div>
  );
}

export default DevBar;
