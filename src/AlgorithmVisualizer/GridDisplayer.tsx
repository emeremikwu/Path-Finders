import {
  ForwardedRef, forwardRef, useContext, useRef,
} from 'react';
import Node from './Node';
import { NodeType } from '../Grid/nodeAttributes';
import { GridContext } from '../Grid/GridProvider';

interface GridDisplayerProps {
  children?: never;
}

function GridDisplayer(_props: GridDisplayerProps, ref: ForwardedRef<HTMLDivElement>) {
  const GridContextObject = useContext(GridContext);

  const { grid } = GridContextObject;
  const { nodes } = grid;
  const currentSetType = useRef<NodeType>(NodeType.wall);

  return (
    <div ref={ref} className="grid-box">
      {
        nodes.map((columns, rowIndex) => {
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
                      endOfRow={rowIndex === nodes.length - 1}
                      endOfCol={colIndex === columns.length - 1}
                      setType={currentSetType}
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

const ForwardedGridDisplayerRef = forwardRef<HTMLDivElement, GridDisplayerProps>(GridDisplayer);
export default ForwardedGridDisplayerRef;
