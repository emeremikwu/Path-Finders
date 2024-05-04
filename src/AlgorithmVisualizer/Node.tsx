import { PropsWithChildren } from 'react';

interface NodeProps {
  id: string | undefined
  endOfRow?: boolean
  endOfCol?: boolean
  startNode?: boolean
  endNode?: boolean
}

function Node(props: PropsWithChildren<NodeProps>) {
  const { id, children, endOfRow, endOfCol } = props;

  
  const endOfRowClass = endOfRow ? " end-of-row" : "";
  const endOfColClass = endOfCol ? " end-of-col" : "";
  
  const nodeClass = `node${endOfRowClass}${endOfColClass}`;
  
  return (
    <div className={nodeClass} id={id}>{children}</div>
  );
}

export default Node;