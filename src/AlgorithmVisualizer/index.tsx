import { PropsWithChildren, useMemo, useRef } from 'react';
import useGrid, { GridContext } from '../Grid/useGrid';
import DevBar from './DevBar';
import DimensionGraph from './DimensionGraph';

import './index.css';
import GridDisplayer from './GridDisplayer';
import { Dimension, IGridContext } from '../Grid/grid.types';

interface IndexProps {
  dimension?: Dimension
}

// dbg

function Index(props: PropsWithChildren<IndexProps>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // [ ] - debut update dimension function
  // [ ] - make the following functions extractable as a Provider

  const { dimension = [20, 50] } = props;

  const {
    grid, setGrid, setNode, getNode, updateDimensions,
  } = useGrid(dimension);

  const memoizedProviderObj = useMemo<IGridContext>(() => ({
    grid, setGrid, updateDimensions, setNode, getNode,
  }), [grid, setGrid, updateDimensions, setNode, getNode]);

  const gridDisplayerRef = useRef<HTMLDivElement>(null);

  // setStartEndNodes(setGridNodes);
  return (
    <GridContext.Provider value={memoizedProviderObj}>
      <div className="grid-container">
        <GridDisplayer ref={gridDisplayerRef} />
        <DimensionGraph GridDisplayerRef={gridDisplayerRef} />
      </div>
      <DevBar />
    </GridContext.Provider>
  );
}

export default Index;
