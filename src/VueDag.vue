<template>
  <DAGContainer
    :height="modelValue.config.height"
    :width="modelValue.config.width"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
    @mousedown="handleMouseDown"
  >
    <template v-if="edges" #edges>
      <DAGEdge
        v-for="edge in edges"
        :id="edge.id"
        :key="'edge_' + edge.id"
        :start="edge.start"
        :end="edge.end"
        :edge-color="edge.edgeColor"
        :arrow-color="edge.arrowColor"
        :readonly="modelValue.config.readonly"
        @deleteEdge="deleteEdge"
      />
      <DAGEdge
        v-if="draftEdge && !modelValue.config.readonly"
        :id="draftEdge.id"
        :start="draftEdge.start"
        :end="draftEdge.end"
        :edge-color="draftEdge.edgeColor"
        :arrow-color="draftEdge.arrowColor"
      />
    </template>
    <template #nodes>
      <DAGNode
        v-for="node in modelValue.nodes"
        :id="node.id"
        :key="'node_' + node.id"
        :x="node.x"
        :y="node.y"
        @selectNode="selectNode($event, node)"
        @linkClick="linkClick"
      >
        <component
          :is="node.component"
          v-if="node.component"
          v-bind="node.props"
          @edit="$emit('edit', node.id)"
          @delete="$emit('delete', node.id)"
        />
        <div v-if="node.content">{{ node.content }}</div>
      </DAGNode>
    </template>
  </DAGContainer>
</template>

<script lang="ts">
import DAGContainer from './components/DAGContainer.vue';
import DAGNode from './components/DAGNode.vue';
import DAGEdge from './components/DAGEdge.vue';
import {
    GraphData,
    GraphNode,
    GraphEdge,
    GraphLinkPosition,
} from '../types/index.d';
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'vue-dag',
    components: {
        DAGContainer,
        DAGNode,
        DAGEdge,
    },
    props: {
        modelValue: {
            type: Object as () => GraphData,
            default: () => ({
                config: {
                    scale: 1,
                    height: '100%',
                    width: '100%',
                    readonly: false,
                },
                nodes: [],
                edges: [],
            }),
        },
    },
    data() {
        return {
            dragging: false,
            newEdge: null as any,
            selected: null as any,
            mouse: {
                x: 0,
                y: 0,
                lastX: 0,
                lastY: 0,
            },
        };
    },
    computed: {
        edges() {
            const edges = this.modelValue.edges.map((edge) => {
                const fromNode = this.modelValue.nodes.find((node) => node.id === edge.from);
                const toNode = this.modelValue.nodes.find((node) => node.id === edge.to);

                if (!fromNode || !toNode) return;
                if (!fromNode.x || !fromNode.y) return;
                if (!toNode.x || !toNode.y) return;

                const [fx, fy] = this.getLinkPosition(edge.fromLink || 'right', fromNode.x, fromNode.y);
                const [tx, ty] = this.getLinkPosition(edge.toLink || 'left', toNode.x, toNode.y);

                return {  // eslint-disable-line
                    ...edge,
                    start: [fx, fy],
                    end: [tx, ty],
                };
            });

            return edges;
        },
        draftEdge() {
            if (!this.newEdge) return null;

            const fromNode = this.modelValue.nodes.find((node) => node.id === this.newEdge.from);

            if (!fromNode || !fromNode.x || !fromNode.y) return null;
            const [fx, fy] = this.getLinkPosition(this.newEdge.fromLink || 'right', fromNode.x, fromNode.y);

            return {
                start: [fx, fy],
                end: [this.newEdge.tx, this.newEdge.ty],
            };
        },
    },
    methods: {
        getLinkPosition(type: string, x: number, y: number): any {
            switch (type) {
            case 'top':
                return [x + 120, y];
            case 'right':
                return [x + 240, y + 40];
            case 'bottom':
                return [x + 120, y + 80];
            case 'left':
                return [x, y + 40];
            default:
                break;
            }
        },
        deleteEdge(id: number): void {
            if (!this.modelValue.config.readonly) {
                this.modelValue.edges = this.modelValue.edges.filter((e) => e.id !== id);
            }
        },
        linkClick(linkPosition: GraphLinkPosition, id: number): void {
            if (!this.modelValue.config.readonly) {
                if (this.newEdge) {
                    this.stopLinking(linkPosition, id);
                } else {
                    this.startLinking(linkPosition, id);
                }
            }
        },
        startLinking(linkPosition: GraphLinkPosition, id: number): void {
            const [mx, my] = [this.mouse.x, this.mouse.y];
            this.newEdge = {
                from: id,
                to: id,
                fromLink: linkPosition,
                tx: mx,
                ty: my,
            };
        },
        stopLinking(linkPosition: GraphLinkPosition, id: number): void {
            if (this.newEdge.from !== id) {
                const exists = this.modelValue.edges.find((edge) => (edge.from === this.newEdge.from && edge.to === id));

                if (!exists) {
                    const maxID = Math.max(
                        0,
                        ...this.modelValue.edges.map((edge) => edge.id),
                    );
                    const newEdge: GraphEdge = {
                        id: maxID + 1,
                        from: this.newEdge.from,
                        fromLink: this.newEdge.fromLink,
                        to: id,
                        toLink: linkPosition,
                    };
                    this.modelValue.edges.push(newEdge);
                    this.$emit('edgeAdded', newEdge);
                }
            }
            this.newEdge = null;
        },
        selectNode(e: MouseEvent, node: GraphNode): void {
            this.selected = node;
            this.mouse.lastX = e.pageX || e.clientX + document.documentElement.scrollLeft;
            this.mouse.lastY = e.pageY || e.clientY + document.documentElement.scrollTop;
        },
        handleMouseMove(e: MouseEvent): void {
            if (this.dragging) {
                this.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft;
                this.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop;

                const dx = this.mouse.x - this.mouse.lastX;
                const dy = this.mouse.y - this.mouse.lastY;
                this.mouse.lastX = this.mouse.x;
                this.mouse.lastY = this.mouse.y;
                this.moveSelectedNode(dx, dy);
            }

            if (this.newEdge) {
                [this.mouse.x, this.mouse.y] = this.getMousePosition(this.$el, e);
                [this.newEdge.tx, this.newEdge.ty] = [this.mouse.x, this.mouse.y];
            }
        },
        handleMouseUp(e: MouseEvent): void {
            const { target } = e;
            this.dragging = false;
        },
        handleMouseDown(e: MouseEvent): void {
            const { target } = e;
            this.dragging = true;
        },
        moveSelectedNode(dx: number, dy: number): void {
            if (!this.selected || !this.selected.x || !this.selected.y) return;
            this.selected.x += dx / (this.modelValue.config.scale || 1);
            this.selected.y += dy / (this.modelValue.config.scale || 1);
        },
        getMousePosition(element: Element, event: MouseEvent) {
            const mouseX = event.pageX || event.clientX + document.documentElement.scrollLeft;
            const mouseY = event.pageY || event.clientY + document.documentElement.scrollTop;

            const offset = this.getOffsetRect(element);
            const x = mouseX - offset.left;
            const y = mouseY - offset.top;

            return [x, y];
        },
        getOffsetRect(element: Element): { top: number, left: number } {
            const box = element.getBoundingClientRect();
            const scrollTop = window.pageYOffset;
            const scrollLeft = window.pageXOffset;
            const top = box.top + scrollTop;
            const left = box.left + scrollLeft;
            return { top: Math.round(top), left: Math.round(left) };
        },
    },
});
</script>
<style lang="scss">
@import './scss/vue-dag.scss';
</style>
