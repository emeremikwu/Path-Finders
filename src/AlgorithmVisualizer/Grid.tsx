
import React, { PropsWithChildren } from "react";
import Node from "./Node";
import useGrid, { Dimension, GridState } from "./useGrid";
import { INodeAttributes } from "./NodeAttribute";

interface GridProps {
  dimension?: Dimension
}


//dbg
function setStartEndNodes(dispach: React.Dispatch<React.SetStateAction<GridState>>) {
  dispach((prev) => {
    const newArr: GridState = [...prev];
    const centerRow = Math.floor(prev.length / 2);
    const centerCol = Math.floor(prev[0].length / 2);

    newArr[centerRow][centerCol].isStart = true;

    return newArr;
  });
}

function Grid(props: PropsWithChildren<GridProps>) {

  const { dimension = { rows: 5, cols: 5 } as Dimension } = props;

  const { gridNodes, setGridNodes, updateGridDimension } = useGrid(dimension);

  // setStartEndNodes(setGridNodes);

  return (
      <div className="grid-container">
        <div className="grid-box">
          {
            gridNodes.map((columns, rowIndex) => {
              const keyRef = `row-${rowIndex.toString()}`;
              return (
                <div className="row" key={keyRef} id={keyRef} >
                  {
                    columns.map((node, colIndex) => {
                      const indexRef = `${rowIndex.toString()}:${colIndex.toString()}`;
                      return (
                        <Node
                          key={indexRef}
                          id={indexRef}
                          endOfRow={rowIndex === gridNodes.length - 1}
                          endOfCol={colIndex === columns.length - 1}
                          node={node}
                         />
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>
      </div>
  );
}

export default Grid;