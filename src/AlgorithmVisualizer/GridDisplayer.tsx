import {
  ForwardedRef, forwardRef, useContext, useRef,
  useState,
} from 'react';
import Node from './Node';
import { NodeType } from '../Grid/nodeAttributes';
import { GridContext } from '../Grid/GridProvider';
import { stringifyLocation } from '../Grid/utils';

interface GridDisplayerProps {
  children?: never;
}

function GridDisplayer(_props: GridDisplayerProps, ref: ForwardedRef<HTMLDivElement>) {
  const GridContextObject = useContext(GridContext);

  const { grid } = GridContextObject;
  const { nodes } = grid;
  const currentSetType = useRef<NodeType>(NodeType.wall);

  const [isLeftMouseDown, setLeftMouseDown] = useState(false);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    // Left mouse button
    if (event.button === 0) setLeftMouseDown(true);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    setLeftMouseDown(false);
  };

  return (
    <div
      ref={ref}
      className="grid-box"
      role="grid" // Add the role attribute
      tabIndex={0} // Add support for tabbing
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {
        nodes.map((columns, rowIndex) => {
          const keyRef = `row-${rowIndex.toString()}`;
          return (
            <div className="grid-row" key={keyRef} id={keyRef}>
              {
                columns.map((node, colIndex) => {
                  // const indexRef = `${rowIndex.toString()}:${colIndex.toString()}`;
                  const indexRef = stringifyLocation(rowIndex, colIndex);
                  return (
                    <Node
                      key={indexRef}
                      id={indexRef}
                      endOfRow={rowIndex === nodes.length - 1}
                      endOfCol={colIndex === columns.length - 1}
                      setType={currentSetType}
                      nodeAttributes={node}
                      isLeftMouseDown={isLeftMouseDown}
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
