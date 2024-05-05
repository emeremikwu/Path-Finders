import { PropsWithChildren } from 'react';
import { INodeAttributes, AssociatedCSSClass } from './NodeAttribute';

interface NodeProps {
  id: string | undefined
  endOfRow?: boolean
  endOfCol?: boolean
  node: INodeAttributes
}

function Node(props: PropsWithChildren<NodeProps>) {
  const { id, children, endOfRow, endOfCol, node } = props;

  const nodeClass = "node";

  
  
  const endOfRowClass = endOfRow ? " end-of-row" : "";
  const endOfColClass = endOfCol ? " end-of-col" : "";

  if (Object.values(node).some((val) => typeof val === 'boolean' && val)) {
    console.log(node);
  }

  // const nodeClass = `node${endOfRowClass}${endOfColClass}`;
  //const nodeClass = `node${endOfRowClass}${endOfColClass}`;
  
  return (
    <div className={nodeClass} id={id}></div>
  );
}

export default Node;