
import { PropsWithChildren, useReducer, Reducer } from "react"

type Dimension = { rows: number, cols: number } | [number, number] | string
type GridState = string[][]
interface GridProps {
  dimensions?: Dimension
}

function convertToGridState(rows: number, cols: number): GridState {
  return Array<null>(rows).fill(null).map((): string[] => Array<string>(cols).fill(""));
}

function isDimensionObject(obj: unknown): obj is { rows: number, cols: number } {

  if (obj === null || typeof obj !== "object") return false

  return "rows" in obj && "cols" in obj && typeof obj.rows === "number" && typeof obj.cols === "number"
}

function isDimensionArray(arr: unknown): arr is [number, number] {
  return Array.isArray(arr) && arr.length === 2 && typeof arr[0] === "number" && typeof arr[1] === "number"
}

function dimensionReducer(prevState: GridState, action: Dimension): GridState {
  // if action is a string
  if (typeof action === "string") {
    const dimValidator = /^(?<rows>\d+)x(?<cols>\d+)$/
    const match = action.match(dimValidator)

    if (match) {
      // groups could be anything so we use as to say that it should have properties "rows" and "cols"
      const { rows, cols } = match.groups as { rows: string, cols: string }
      return convertToGridState(parseInt(rows), parseInt(cols))
    }

    console.error("Invalid dimension format. Please use the format 'rows x cols' e.g. '5x5'")

  }

  // if action is an object
  else if (isDimensionObject(action)) {
    const { rows, cols } = action;
    return convertToGridState(rows, cols)

  }

  // if action is an array 
  else if (isDimensionArray(action)) {
    const [rows, cols] = action;
    return convertToGridState(rows, cols)
  }

  return prevState;
}

function createInitialGridState(dimensions: Dimension): GridState {
  return dimensionReducer([], dimensions)
}

function Grid(props: PropsWithChildren<GridProps>) {

  const { dimensions = { rows: 5, cols: 5 } } = props
  const initialGridState: GridState = createInitialGridState(dimensions);

  const [gridNodes, setGridNodes] = useReducer<Reducer<GridState, Dimension>>(dimensionReducer, initialGridState)

  console.log(gridNodes); 

  return (
    <div id="Grid-Container"></div>
  )
}

export default Grid