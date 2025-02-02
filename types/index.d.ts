declare interface GraphConfig {
  scale?: number;
  height?: string;
  width?: string;
  readonly: boolean;
}

declare interface GraphNode {
  id: number;
  content?: string;
  component?: Object;
  props?: Object;
  x?: number;
  y?: number;
}

declare type GraphLinkPosition = 'top' | 'right' | 'bottom' | 'left';

declare interface GraphEdge {
  id: number;
  content?: string;
  from: number;
  to: number;
  fromLink?: GraphLinkPosition;
  toLink?: GraphLinkPosition;
  edgeColor?: string;
  arrowColor?: string;
}

declare interface GraphData {
  config: GraphConfig;
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export { GraphData, GraphConfig, GraphEdge, GraphNode, GraphLinkPosition };

