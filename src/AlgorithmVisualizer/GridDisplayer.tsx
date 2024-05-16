import { ForwardedRef, forwardRef, useContext } from 'react';
import { GridContext } from '../Grid/useGrid';
import { IGridContext } from '../Grid/grid.types';
import Node from './Node';

interface GridDisplayerProps {
  children?: never;
}

type Ref = HTMLDivElement;

function GridDisplayer(_props: GridDisplayerProps, ref: ForwardedRef<Ref>) {
  const GridContextObject = useContext<IGridContext | null>(GridContext);

  if (!GridContextObject) {
    throw new Error('GridContext is null');
  }

  const { grid } = GridContextObject;
  const { nodes: gridNodes } = grid;

  return (
    <div ref={ref} className="grid-box">
      {
        gridNodes.map((columns, rowIndex) => {
          const keyRef = `row-${rowIndex.toString()}`;
          return (
            <div className="grid-row" key={keyRef} id={keyRef}>
              {
                columns.map((node, colIndex) => {
                  const indexRef = `${rowIndex.toString()}:${colIndex.toString()}`;
                  return (
                    <Node
                      key={indexRef}
                      id={indexRef}
                      endOfRow={rowIndex === gridNodes.length - 1}
                      endOfCol={colIndex === columns.length - 1}
                      nodeAttributes={node}
                    />
                  );
                })
              }
            </div>
          );
        })
      }
    </div>
  );
}

const ForwardedGridDisplayerRef = forwardRef<Ref, GridDisplayerProps>(GridDisplayer);
export default ForwardedGridDisplayerRef;
