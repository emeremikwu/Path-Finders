import { useState } from 'react';
import { Algorithm } from './algorithms.types';

export function useAlgorithm() {
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.dijkstra);
  const [results, setResults] = useState<AlgorithmResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  console.log(algorithm, setAlgorithm);
}

export default useAlgorithm;
