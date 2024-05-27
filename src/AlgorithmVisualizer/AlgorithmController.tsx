import { useContext } from 'react';
import { GridContext } from '../Grid/GridProvider';

function AlgorithmController() {
  const {
    grid, setGrid, updateDimensions, setNode, getNode,
  } = useContext(GridContext);
}

export default AlgorithmController;
