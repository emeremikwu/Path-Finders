import { useState } from 'react';

enum Algorithm {
  dijkstra = 'dijkstra',
  aStar = 'aStar',
  bfs = 'bfs',
  dfs = 'dfs',
}

function Index() {
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.dijkstra);

  console.log(algorithm, setAlgorithm);
}

export default Index;
