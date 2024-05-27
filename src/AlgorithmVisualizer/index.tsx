import {
  PropsWithChildren, useCallback, useMemo, useRef,
} from 'react';
import useGrid from '../Grid/useGrid';
import DevBar from './DevBar';
import DimensionGraph from './DimensionGraph';

import './index.css';
import GridDisplayer from './GridDisplayer';
import { Dimension } from '../Grid/grid.types';
import GridProvider from '../Grid/GridProvider';
import { useAlgorithm } from '../Algorithms';

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

  const memoizedContextObject = useMemo(() => ({
    grid, setGrid, updateDimensions, setNode, getNode,
  }), [grid, setGrid, updateDimensions, setNode, getNode]);

  const gridDisplayerRef = useRef<HTMLDivElement>(null);

  // setStartEndNodes(setGridNodes);
  return (
    <GridProvider gridContextObject={memoizedContextObject}>
      <div className="grid-container">
        <GridDisplayer ref={gridDisplayerRef} />
        <DimensionGraph GridDisplayerRef={gridDisplayerRef} />
      </div>
      <DevBar />
    </GridProvider>
  );
}

export default Index;
