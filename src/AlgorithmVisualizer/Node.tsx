/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  PropsWithChildren, RefObject, useCallback, useContext,
} from 'react';
import { INodeAttributes, NodeType } from '../Grid/NodeAttributes';
import './Node.css';
import { GridContext } from '../Grid/GridProvider';

interface NodeProps {
  id: string | undefined
  endOfRow?: boolean
  endOfCol?: boolean
  nodeAttributes: INodeAttributes
  // references the node type to change to when the user clickes a node,
  setType: RefObject<NodeType>
}

function Node(props: PropsWithChildren<NodeProps>) {
  const { setNode } = useContext(GridContext);
  const {
    id, endOfRow = false, endOfCol = false, nodeAttributes, setType,
  } = props;
  const { type, visited, weight } = nodeAttributes;

  const clickHandler = useCallback(() => {
    const [currentRow, currentCol] = id!.split(':').map((val) => Number(val));
    const attributes: Partial<INodeAttributes> = { type: setType.current!, weight: 1 };

    setNode(currentRow, currentCol, attributes);
    console.log(`Node ${id} clicked. Current set type: ${setType.current}`);
  }, [id, setType, setNode]);

  // nice and maintainable
  const nodeClass = ['node'];

  if (type !== NodeType.default) nodeClass.push(type);
  if (visited) nodeClass.push('visited');
  // if (weight > 1) nodeClass.push(`weight-${weight}`);
  if (endOfRow) nodeClass.push('end-of-row');
  if (endOfCol) nodeClass.push('end-of-col');

  const joinedNodeClass = nodeClass.join(' ');
  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div className={joinedNodeClass} id={id} onClick={() => clickHandler()}>
      <span>{weight > 1 ? weight : ''}</span>
    </div>
  );
}

export default Node;
