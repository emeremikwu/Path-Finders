import {
  memo,
  PropsWithChildren,
  useMemo,
  useRef,
  useState,
} from 'react';
import useGrid from '../Grid/useGrid';
import DevBar from './DevBar';
import DimensionGraph from './DimensionGraph';

import GridDisplayer from './GridDisplayer';
import GridProvider from '../Grid/GridProvider';
import GridController from './GridNavController';
import { Dimension } from '../Grid/grid.types';
import { AlgorithmType } from '../Algorithms/algorithms.types';

import './index.css';
import './Grid.css';
import { ThemeProvider } from '../ThemeProvider';

interface IndexProps {
  dimension?: Dimension
}

function Index(props: PropsWithChildren<IndexProps>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // [ ] - debut update dimension function
  // [ ] - make the following functions extractable as a Provider

  const { dimension = [20, 50] } = props;

  const {
    grid, setGrid, setNode, getNode, updateDimensions,
  } = useGrid(dimension);

  const gridDisplayerRef = useRef<HTMLDivElement>(null);
  const [, setAlgorithm] = useState(AlgorithmType.dijkstra);
  const [, setPlaybackSpeed] = useState(1);
  // const nodeSelectorType = useRef();

  const memoizedContextObject = useMemo(() => ({
    grid, setGrid, updateDimensions, setNode, getNode,
  }), [grid, setGrid, updateDimensions, setNode, getNode]);

  const references = { setAlgorithm, setPlaybackSpeed };

  // setStartEndNodes(setGridNodes);
  return (
    <ThemeProvider>
      <GridProvider gridContextObject={memoizedContextObject}>
        <GridController references={references} />
        <div className="grid-container">
          <GridDisplayer ref={gridDisplayerRef} />
          <DimensionGraph GridDisplayerRef={gridDisplayerRef} />
        </div>
        <DevBar />
      </GridProvider>
    </ThemeProvider>
  );
}

const MemoizedIndex = memo(Index);

export default MemoizedIndex;
