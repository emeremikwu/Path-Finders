import { useState } from 'react';
import { Algorithm, AlgorithmResult } from './algorithms.types';
import { dikstras } from './Dikstras';
import { IGrid } from '../Grid/grid.types';

export function useAlgorithm(grid: IGrid) {
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.dijkstra);
  const [results, setResults] = useState<AlgorithmResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAlgorithm = async () => {
    setIsRunning(true);
    switch (algorithm) {
      case Algorithm.dijkstra:
        setResults(await dikstras(grid));
        break;
      default:
        break;
    }
    setIsRunning(false);
  };

  return {
    algorithm, setAlgorithm, results, runAlgorithm, isRunning,
  };
}

export default useAlgorithm;
