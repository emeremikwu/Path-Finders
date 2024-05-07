// TODO:

import { PropsWithChildren, useRef } from 'react';
import Node from './Node';
import useGrid, { Dimension } from './useGrid';
import DevBar from './DevBar';
import DimensionGraph from './DimensionGraph';

interface GridProps {
  dimension?: Dimension
}

// dbg

function Grid(props: PropsWithChildren<GridProps>) {
  const { dimension = { rows: 5, cols: 5 } as Dimension } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // [ ] - debut update dimension function
  // [ ] - make the following functions extractable as a Provider
  const { gridNodes, setGridNodes, updateDimensions } = useGrid(dimension);

  const gridBoxRef = useRef<HTMLDivElement>(null);

  // setStartEndNodes(setGridNodes);
  return (
    <>
      <div className="grid-container">
        <div ref={gridBoxRef} className="grid-box">
          {
            gridNodes.map((columns, rowIndex) => {
              const keyRef = `row-${rowIndex.toString()}`;
              return (
                <div className="row" key={keyRef} id={keyRef}>
                  {
                    columns.map((node, colIndex) => {
                      const indexRef = `${rowIndex.toString()}:${colIndex.toString()}`;
                      return (
                        <Node
                          key={indexRef}
                          id={indexRef}
                          endOfRow={rowIndex === gridNodes.length - 1}
                          endOfCol={colIndex === columns.length - 1}
                          NodeAttributes={node}
                        />
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>
        {/* fix or remove gridNodes */}
        <DimensionGraph grid={gridNodes} gridBoxRef={gridBoxRef} />
      </div>
      <DevBar gridAccess={{ gridNodes, dispatchFunction: setGridNodes }} />
    </>
  );
}

export default Grid;
