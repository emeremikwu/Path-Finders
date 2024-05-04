
import { PropsWithChildren } from "react";
import Node from "./Node";
import useGrid, { Dimension } from "./useGrid";

interface GridProps {
  dimension?: Dimension
}

function Grid(props: PropsWithChildren<GridProps>) {

  const { dimension = { rows: 5, cols: 5 } as Dimension } = props;

  const { gridNodes, setGridNodes, updateGridDimension } = useGrid(dimension);

  return (
    <>
      <button onClick={() => { updateGridDimension('8x8'); }}>update grid</button>
      <div id="grid-container">
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
                      >
                        {node}
                      </Node>
                    );
                  })
                }
              </div>
            );
          })
        }
      </div>
    </>
  );
}

export default Grid;