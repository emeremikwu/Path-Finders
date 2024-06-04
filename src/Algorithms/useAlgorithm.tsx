// TODO:
import { useCallback, useMemo, useState } from 'react';
import { Algorithm, AlgorithmResult } from './algorithms.types';
import { dikstras } from './dikstras';
import { IGrid } from '../Grid/grid.types';
import AStar from './aStar';

export function useAlgorithm(grid: IGrid) {
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.dijkstra);
  const [results, setResults] = useState<AlgorithmResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  // [ ] - isRunning doesn't work properly, when clicking run dikstras and it fails it doesn't reset
  const runAlgorithm = useCallback(async () => {
    setIsRunning(true);
    switch (algorithm) {
      case Algorithm.dijkstra:
        setResults(await dikstras(grid));
        break;

      case Algorithm.aStar:
        setResults(await AStar(grid));
        break;

      default:
        break;
    }
    setIsRunning(false);
  }, [algorithm, grid]);

  const memoizedAlgorithmFunctions = useMemo(() => ({
    algorithm,
    setAlgorithm,
    results,
    runAlgorithm,
    isRunning,
  }), [algorithm, setAlgorithm, results, runAlgorithm, isRunning]);

  return memoizedAlgorithmFunctions;
}

export default useAlgorithm;
