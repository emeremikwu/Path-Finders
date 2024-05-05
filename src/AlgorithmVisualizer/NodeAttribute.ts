/* eslint-disable @typescript-eslint/no-unused-vars */
export interface INodeAttributes {
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isShortestPath: boolean;
  isPath: boolean;
  isWeight: boolean;
  isWeighted: boolean;
}

export const AssociatedCSSClass = {
  isStart: "start",
  isEnd: "end",
  isWall: "wall",
  isVisited: "visited",
  isShortestPath: "shortest-path",
  isPath: "path",
  isWeight: "weight",
  isWeighted: "weighted",
};

/* class NodeAttributes {

  constructor(parameters: Partial<INodeAttributes>) {
    this.#setAttributes(parameters);
  }

  #setAttributes(parameters: Partial<INodeAttributes>) {
    let { 
      isStart = false,
      isEnd = false,
      isWall = false,
      isVisited = false,
      isShortestPath = false,
      isPath = false,
      isWeight = false,
      isWeighted = false
    } = parameters;

    if()

    Object.assign(this, parameters);
  }

  // Optional setter for isWeight with validation
  set isWeight(value: boolean) {
    if (value && !this.isWall) {
      this.isWeighted = value;
    } else {
      throw new Error("A Weighted node cannot be a Wall");
    }
  }

  setAttribute(parameters: Partial<INodeAttributes>) {
    this.#setAttributes(parameters);
  }
}
 */


const NodeAttributes = {
  isStart: false,
  isEnd: false,
  isWall: false,
  isVisited: false,
  isShortestPath: false,
  isPath: false,
  isWeight: false,
  isWeighted: false,
};

/* // Usage
const node1Attributes = new NodeAttributes({
  isStart: true,
  isEnd: false,
  isWall: false,
  isVisited: false,
  isShortestPath: false,
  isPath: false,
  isWeighted: true, // Will throw an error as Start node cannot be weighted
});

const node2Attributes = new NodeAttributes({
  isStart: false,
  isEnd: true,
  isWall: false,
  isVisited: false,
  isShortestPath: false,
  isPath: false,
  isWeighted: true,
});
 */

export default NodeAttributes;