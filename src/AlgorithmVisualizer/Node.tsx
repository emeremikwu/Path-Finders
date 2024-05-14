import { PropsWithChildren } from 'react';
import { INodeAttributes, NodeType } from '../Grid/NodeAttributes';
import './Node.css';

interface NodeProps {
  id: string | undefined
  endOfRow?: boolean
  endOfCol?: boolean
  nodeAttributes: INodeAttributes
}

function Node(props: PropsWithChildren<NodeProps>) {
  const {
    id, endOfRow = false, endOfCol = false, nodeAttributes,
  } = props;

  const { type, visited, weight } = nodeAttributes;

  // nice and maintainable
  const classNames = ['node'];

  if (type !== NodeType.default) {
    classNames.push(type);
    debugger;
  }
  if (visited) classNames.push('visited');
  if (weight > 1) classNames.push(`weight-${weight}`);
  if (endOfRow) classNames.push('end-of-row');
  if (endOfCol) classNames.push('end-of-col');

  const nodeClass = classNames.join(' ');
  return (
    <div className={nodeClass} id={id} />
  );
}

export default Node;
