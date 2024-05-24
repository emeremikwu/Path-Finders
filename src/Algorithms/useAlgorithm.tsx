import { useState } from 'react';
import { Algorithm } from './algorithms.types';
import dikstras from './Dikstras';

export function useAlgorithm() {
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.dijkstra);
  const [results, setResults] = useState<AlgorithmResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runAlgorithm = async () => {
    setIsRunning(true);
    switch (algorithm) {
      case Algorithm.dijkstra:
        setResults(await dikstras());
        break;
      default:
        break;
    }
    setIsRunning(false);
  };
}

export default useAlgorithm;
