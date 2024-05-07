/* eslint-disable arrow-spacing */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useState,
  CSSProperties,
  ReactNode,
  useEffect,
} from 'react';

import './DimensionGraph.css';
import useScreenUpdate from '../utils/useScreenUpdate';

// type ShortDispach<T> = Dispatch<SetStateAction<T>>;

interface DimensionGraphProps {
  gridBoxRef: React.RefObject<HTMLDivElement>;
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
  gridBoxRef, xBarText, yBarText, xBarChildren, yBarChildren,
}: DimensionGraphProps) {
  const [xBarOffset, setXBarOffset] = useState<CSSProperties>(DefaultCSSProperties);
  const [yBarOffset, setYBarOffset] = useState<CSSProperties>(DefaultCSSProperties);
  const screenUpdate = useScreenUpdate();

  // const [gridOffsets, setGridOffsets] = useState<[number, number] | null>(null);

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
    console.log('bar function called');
  }, [gridBoxRef, screenUpdate]);

  return (
    <>
      <div className="dimension-graph" id="horizontal-bar" style={xBarOffset}>
        <hr />
        { xBarChildren ?? (
        <div className="text">
          {
            xBarText ?? 'x-bar'
          }
        </div>
        )}
      </div>

      <div className="dimension-graph" id="vertical-bar" style={yBarOffset}>
        <hr />
        {yBarChildren ?? (
        <div className="text">
          {
            yBarText ?? 'y-bar'
          }
        </div>
        )}
      </div>
    </>
  );
}

const MemoizedDimensionGraph = React.memo(DimensionGraph);
export default MemoizedDimensionGraph;