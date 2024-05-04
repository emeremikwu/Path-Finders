import { useState } from "react";

// I'm probably gonna have to remove 90% of the useReducer stuff and just use useState.
interface DimensionObject { rows: number, cols: number }
type DimensionArray = [number, number]
type DimensionString = string
export type Dimension = DimensionObject | DimensionArray | DimensionString

type GridState = string[][]

function createGrid(rows: number, cols: number): GridState {
  return Array<null>(rows).fill(null).map(() => Array<string>(cols).fill(""));
}

function isDimensionArray(dimension: Dimension): dimension is DimensionArray {
  if (!Array.isArray(dimension)) return false;

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (dimension.length !== 2) return false;

  if (dimension.some((val) => typeof val !== 'number' || val <= 0)) return false;

  return true;
}

function isDimensionObject(dimension: Dimension): dimension is DimensionObject {

  if (typeof dimension !== 'object') return false;

  if (!('rows' in dimension) || !('cols' in dimension)) return false;

  if (typeof dimension.rows !== 'number' || typeof dimension.cols !== 'number') return false;

  if (dimension.rows <= 0 || dimension.cols <= 0) return false;

  return true;
}


function parseDimension(dimension: Dimension, delimiter?: string): DimensionArray {

  if (typeof dimension === "string") {
    //const dimValidator = /^(?<rows>\d+)[x|X|](?<cols>\d+)$/
    const dimValidator = new RegExp(`^(?<rows>\\d+)[x|X|${delimiter ?? ""}](?<cols>\\d+)$`);
    const match = dimension.match(dimValidator);

    if (match) {
      const { rows, cols } = match.groups as { rows: string, cols: string };

      if (parseInt(rows) > 0 && parseInt(cols) > 0)
        return [parseInt(rows), parseInt(cols)];
    }
  }

  if (isDimensionArray(dimension)) {
    return dimension;
  }

  if (isDimensionObject(dimension)) {
    return [dimension.rows, dimension.cols];
    
  }


  throw new Error("Invalid dimension format");
}

function useGrid(dimensions: Dimension, delimiter?: string) {

  const [rows, cols] = parseDimension(dimensions, delimiter);

  const [gridNodes, setGridNodes] = useState<GridState>(createGrid(rows, cols));

  const updateGridDimension = (dimension: Dimension): void => {
    const [rows, cols] = parseDimension(dimension);
    setGridNodes(createGrid(rows, cols));
    console.log(`Updated grid dimension to ${String(rows)}x${String(cols)}`);
  };

  const x = [1,3,45,3];
  x.map((arr)=>{
    console.log(arr);
  });

  return {
    gridNodes,
    setGridNodes,
    updateGridDimension
  };
}

export default useGrid;