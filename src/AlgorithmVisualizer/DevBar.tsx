/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { MouseEvent, useContext, useEffect } from 'react';
import { GridContext } from '../Grid/GridProvider';
import { NodeAttributes, NodeType } from '../Grid/nodeAttributes';
import { IGrid, NodeLocation } from '../Grid/grid.types';
import { findEndpoints, getAbsoluteLocation, stringifyLocationObject } from '../Grid/utils';

import './DevBar.css';
import { useAlgorithm } from '../Algorithms';
import { clearNodes, setNode } from '../Grid/mutaters';
import { AlgorithmType } from '../Algorithms/algorithms.types';

function printDebugInfo(grid: IGrid): void {
  const dimensions = grid.shape;
  const startSet: boolean = grid.startNodeSet;
  const endSet: boolean = grid.endNodeSet;

  const endpoints = findEndpoints(grid);

  console.log(`Grid Dimensions: ${dimensions[0]}x${dimensions[1]}`);
  console.log(`Start Node Set: ${startSet} Location: ${startSet ? `${endpoints[0]?.row}x${endpoints[0]?.col}` : ''}`);
  console.log(`End Node Set: ${endSet} Location: ${endSet ? `${endpoints[1]?.row}x${endpoints[1]?.col}` : ''}`);
  console.log(`Node Count: ${grid.nodeRegistry.size}`);
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

function setRandomEndpoints(_event: MouseEvent<HTMLButtonElement>, dispach: React.Dispatch<React.SetStateAction<IGrid>>): void {
  /* const target = event.target as HTMLButtonElement;
  target.disabled = true;
 */

  const modifiedNodes: ReturnType<typeof setNode>[] = [];

  dispach((prev) => {
    const newGrid = { ...prev };
    clearNodes(newGrid, {}, true);
    const [rows, cols] = [newGrid.nodes.length, newGrid.nodes[0].length];

    const [x0, y0] = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];
    const [x1, y1] = [Math.floor(Math.random() * rows), Math.floor(Math.random() * cols)];

    modifiedNodes.push(setNode(newGrid, { row: x0, col: y0, startFromOne: false }, { type: NodeType.start }));
    modifiedNodes.push(setNode(newGrid, { row: x1, col: y1, startFromOne: false }, { type: NodeType.end }));

    return newGrid;
  });

  modifiedNodes.forEach((node) => {
    const loc = Array.isArray(node.location) ? node.location[0] : node.location;
    console.log(`Node: ${stringifyLocationObject(loc)} Type: ${node.attributes.type}`);
  });
}

function setRandomWeights(_event: MouseEvent<HTMLButtonElement>, dispach: React.Dispatch<React.SetStateAction<IGrid>>): void {
  /* const target = event.target as HTMLButtonElement;
  target.disabled = true; */

  dispach((prev) => {
    const newGrid = { ...prev };
    const [rows, cols] = [newGrid.nodes.length, newGrid.nodes[0].length];

    for (let i = 0; i < rows; i += 1) {
      for (let j = 0; j < cols; j += 1) {
        const node = newGrid.nodes[i][j];
        if (node.type !== NodeType.start && node.type !== NodeType.end) {
          // node.weight = Math.floor(Math.random() * 10) + 1;
          const weight = Math.floor(Math.random() * 10) + 1;
          setNode(newGrid, { row: i, col: j, startFromOne: false }, { weight });
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
  const { grid, setGrid: gridDispatch } = useContext(GridContext);

  const {
    isRunning, runAlgorithm, results, algorithm,
  } = useAlgorithm(grid);

  useEffect(() => {
    if (results) console.log(results);
  }, [results]);

  // statically displayed algorithnm
  /* useEffect(() => {
    setGrid((prev) => {
      const newGrid = { ...prev };
      if (results) {
        results.visitedNodes.forEach((location) => {
          const [row, col] = getAbsoluteLocation(newGrid, location, true);
          const currentNode = newGrid.nodes[row][col];
          if (currentNode.type !== NodeType.start && currentNode.type !== NodeType.end) {
            // currentNode.type = NodeType.visited;
            currentNode.visited = true;
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
  }, [setGrid, results]); */

  // animated algorithm;
  useEffect(() => {
    let interval: number;
    if (results) {
      const resultsCopy = { ...results };

      const avoidStartEnd = (location: NodeLocation): boolean => {
        const [row, col] = getAbsoluteLocation(grid, location, true);
        const currentNode = grid.nodes[row][col];
        return currentNode.type !== NodeType.start && currentNode.type !== NodeType.end;
      };
      resultsCopy.visitedNodes = resultsCopy.visitedNodes.filter(avoidStartEnd);
      resultsCopy.shortestPath = resultsCopy.shortestPath?.filter(avoidStartEnd);

      const visitedSpliceAmount = 4;
      const shortestPathSpliceAmount = 1;
      interval = window.setInterval(() => {
        let location: NodeLocation[] | null;
        let attributes: Partial<NodeAttributes> | null;

        if (resultsCopy.visitedNodes.length > 0) {
          location = resultsCopy.visitedNodes.splice(0, visitedSpliceAmount)!;
          attributes = { visited: true };
        } else if (resultsCopy.shortestPath && resultsCopy.shortestPath.length > 0) {
          location = resultsCopy.shortestPath.splice(0, shortestPathSpliceAmount)!;
          attributes = { type: NodeType.shortestPath };
        } else {
          location = null;
          attributes = null;
        }

        if (location !== null && attributes !== null) {
          gridDispatch((prev) => {
            const newGrid = { ...prev };
            setNode(newGrid, location, attributes);
            return newGrid;
          });
        } else {
          clearInterval(interval);
        }
      });
    }

    return () => { if (interval) clearInterval(interval); };
  // we don't want grid here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridDispatch, results]);

  return (
    <div className="node-dev-tools">
      <div className="background-text glow">Dev Tools</div>
      <button className="dev-button" type="button" id="10" onClick={() => { printDebugInfo(grid); }}>Print Debug Info</button>
      {/* <button className="dev-button" type="button" id="20" onClick={(e) => { setEndpoints(e, dispatchFunction); }}>Set Endpoints </button> */}
      <button className="dev-button" type="button" id="20" onClick={(e) => { setRandomEndpoints(e, gridDispatch); }}>Set Random Endpoints </button>
      <button className="dev-button" type="button" id="30" onClick={(e) => { setRandomWeights(e, gridDispatch); }}>Set Random Weights</button>
      <button className="dev-button" type="button" id="30" onClick={() => { breakpoint(grid); }}>Breakpoint</button>
      {/* eslint-disable-next-line @typescript-eslint/no-floating-promises */}

      <form>
        <select name="algorithm" id="algorithm-selector" title="Select Algorithm" onChange={(e) => { algorithm.current = e.target.value as AlgorithmType; }}>
          {Object.values(AlgorithmType).map((algo) => (
            <option key={algo} value={algo}>{algo}</option>
          ))}
        </select>
        {/* eslint-disable-next-line @typescript-eslint/no-floating-promises */}
        <button className="dev-button" type="button" onClick={() => { runAlgorithm(); }} disabled={isRunning}>
          {isRunning ? 'Running' : 'Run'}
        </button>
      </form>
    </div>
  );
}

export default DevBar;
