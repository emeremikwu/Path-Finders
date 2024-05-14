import { PropsWithChildren, useMemo, useRef } from 'react';
import useGrid, { GridContext } from '../Grid/useGrid';
import DevBar from './DevBar';
import DimensionGraph from './DimensionGraph';

import './index.css';
import GridDisplayer from './GridDisplayer';
import { Dimension } from '../Grid/Grid';

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
    grid, setGrid, setNode, updateDimensions,
  } = useGrid(dimension);

  const memoizedProviderObj = useMemo(() => ({
    grid, setGrid, setNode, updateDimensions,
  }), [grid, setGrid, setNode, updateDimensions]);

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
