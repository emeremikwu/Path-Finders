/* eslint-disable arrow-spacing */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useState,
  CSSProperties,
  ReactNode,
  useEffect,
  useContext,
} from 'react';

import './DimensionGraph.css';
import useScreenUpdate from '../utils/useScreenUpdate';
import { GridContext } from '../Grid/useGrid';
import { IGridContext } from '../Grid/grid.types';
// type ShortDispach<T> = Dispatch<SetStateAction<T>>;

interface DimensionGraphProps {
  GridDisplayerRef: React.RefObject<HTMLDivElement>;
  xBarText?: string;
  yBarText?: string;
  // pointless right now but for the future
  xBarChildren?: ReactNode;
  yBarChildren?: ReactNode;
}

const DefaultCSSProperties: CSSProperties = {
  top: undefined,
  left: undefined,
  bottom: undefined,
  right: undefined,
  display: 'none',
};

function DimensionGraph({
  GridDisplayerRef: gridBoxRef, xBarText, yBarText, xBarChildren, yBarChildren,
}: DimensionGraphProps) {
  const [xBarOffset, setXBarOffset] = useState<CSSProperties>(DefaultCSSProperties);
  const [yBarOffset, setYBarOffset] = useState<CSSProperties>(DefaultCSSProperties);
  const screenUpdate = useScreenUpdate();

  const GridContextObject = useContext<IGridContext | null>(GridContext);

  if (!GridContextObject) {
    throw new Error('GridContext is null');
  }

  const { grid } = GridContextObject;

  const [gridLength, gridWidth] = grid.shape;

  useEffect(() => {
    const gridBoxReference = gridBoxRef.current ?? document.querySelector<HTMLDivElement>('.grid-box');

    if (gridBoxReference) {
      const { offsetTop, offsetLeft } = gridBoxReference;
      const boundingBox = gridBoxReference.getBoundingClientRect();

      // puts the line at the bottom, offset of the box + height of the box + some
      setXBarOffset((prev) => ({
        ...prev,
        top: offsetTop + boundingBox.height + 4,
        width: boundingBox.width,
        display: 'block',
      }));

      setYBarOffset((prev) => ({
        ...prev,
        left: offsetLeft + boundingBox.width + 8,
        height: boundingBox.height,
        display: 'block',
      }));
    } else {
      // if the gridBoxRef is null, set the offsets to default
      setXBarOffset(DefaultCSSProperties);
      setYBarOffset(DefaultCSSProperties);
    }
  }, [gridBoxRef, screenUpdate]);

  return (
    <>
      <div className="dimension-graph" id="horizontal-bar" style={xBarOffset}>
        <hr />
        { xBarChildren ?? (
        <div className="text">
          {
            xBarText ?? `x-bar | cols: ${gridWidth}`
          }
        </div>
        )}
      </div>

      <div className="dimension-graph" id="vertical-bar" style={yBarOffset}>
        <hr />
        {yBarChildren ?? (
        <div className="text">
          {
            yBarText ?? `y-bar | rows: ${gridLength}`
          }
        </div>
        )}
      </div>
    </>
  );
}

const MemoizedDimensionGraph = React.memo(DimensionGraph);
export default MemoizedDimensionGraph;
