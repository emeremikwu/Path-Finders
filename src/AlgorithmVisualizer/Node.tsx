import { PropsWithChildren } from 'react';
import { INodeAttributes, AssociatedCSSClass } from './NodeAttributes';
import './Node.css';

interface NodeProps {
  id: string | undefined
  endOfRow?: boolean
  endOfCol?: boolean
  NodeAttributes: INodeAttributes
}

/**
 * Reduce function that returns the CSS class name for a Node based on its attributes
 * @param acc
 * @param classNameAcc
 * @param param1
 * @returns string
 */
function NodeClassReducer(
  classNameAcc: string,
  [attrKey, attrValue]: [string, boolean],
): string {
  if (attrValue && attrKey in AssociatedCSSClass) {
    return `${classNameAcc} ${AssociatedCSSClass[attrKey as keyof typeof AssociatedCSSClass]}`;
  }
  return classNameAcc; // Return the accumulator if no condition is met
}

function Node(props: PropsWithChildren<NodeProps>) {
  const {
    id, endOfRow = false, endOfCol = false, NodeAttributes,
  } = props;

  // const nodeClass = "node";

  let nodeClass: string = Object.entries(NodeAttributes).reduce(NodeClassReducer, 'node');

  const endOfRowClass = endOfRow ? ' end-of-row' : '';
  const endOfColClass = endOfCol ? ' end-of-col' : '';
  nodeClass = nodeClass.concat(endOfRowClass, endOfColClass);

  // debug
  /*   if (Object.values(NodeAttributes).some((val) => typeof val === 'boolean' && val)) {
    console.log(nodeClass);
  }
 */
  // const nodeClass = `node${endOfRowClass}${endOfColClass}`;
  // const nodeClass = `node${endOfRowClass}${endOfColClass}`;

  return (
    <div className={nodeClass} id={id} />
  );
}

export default Node;
