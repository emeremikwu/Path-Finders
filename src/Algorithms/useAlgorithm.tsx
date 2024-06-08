// TODO:
import {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { AlgorithmType, AlgorithmResult } from './algorithms.types';
import { dikstras } from './dikstras';
import { IGrid } from '../Grid/grid.types';
import AStar from './aStar';

export function useAlgorithm(grid: IGrid) {
  const algorithm = useRef(AlgorithmType.dijkstra);
  const [results, setResults] = useState<AlgorithmResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  // [ ] - isRunning doesn't work properly, when clicking run dikstras and it fails it doesn't reset
  const runAlgorithm = useCallback(async () => {
    setIsRunning(true);
    switch (algorithm.current) {
      case AlgorithmType.dijkstra:
        setResults(await dikstras(grid));
        break;

      case AlgorithmType.aStar:
        setResults(await AStar(grid));
        break;

      default:
        break;
    }
    setIsRunning(false);
  }, [algorithm, grid]);

  const memoizedAlgorithmFunctions = useMemo(() => ({
    algorithm,
    results,
    runAlgorithm,
    isRunning,
  }), [algorithm, results, runAlgorithm, isRunning]);

  return memoizedAlgorithmFunctions;
}

export default useAlgorithm;
