<template>
  <g @mouseover="handleMouseOver" @mouseleave="handleMouseLeave">
    <path :d="dAttr" :style="pathStyle"></path>
    <a v-if="showDelete" @click="deleteEdge">
      <text text-anchor="middle" :transform="arrowTransform" font-size="22">&times;</text>
    </a>
    <path v-else d="M -1 -1 L 0 1 L 1 -1 z" :style="arrowStyle" :transform="arrowTransform"></path>
  </g>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'dag-edge',
    props: {
        start: {
            type: Object as PropType<number[]>,
            default: () => [0, 0],
        },
        end: {
            type: Object as PropType<number[]>,
            default: () => [0, 0],
        },
        edgeColor: {
            type: String,
            default: '#12c2e9',
        },
        arrowColor: {
            type: String,
            default: '#12c2e9',
        },
        id: {
            type: Number,
            required: true,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showDelete: false,
        };
    },
    computed: {
        pathStyle(): { stroke: string, strokeWidth: number, fill: string } {
            return {
                stroke: this.edgeColor,
                strokeWidth: 2.75,
                fill: 'none',
            };
        },
        arrowStyle(): { stroke: string, strokeWidth: number, fill: string } {
            return {
                stroke: this.arrowColor,
                strokeWidth: 6,
                fill: 'none',
            };
        },
        arrowTransform(): string {
            const [arrowX, arrowY] = this.caculateCenterPoint();
            const degree = this.caculateRotation();
            return `translate(${arrowX}, ${arrowY}) rotate(${degree})`;
        },
        dAttr(): string {
            const sx = this.start[0];
            const sy = this.start[1];
            const ex = this.end[0];
            const ey = this.end[1];

            const x1 = sx;
            const y1 = sy;
            const x2 = ex;
            const y2 = ey;
            return `M ${sx}, ${sy} C ${x1}, ${y1}, ${x2}, ${y2}, ${ex}, ${ey}`;
        },
    },
    methods: {
        handleMouseOver(): void {
            if (!this.readonly) {
                this.showDelete = true;
            }
        },
        handleMouseLeave(): void {
            this.showDelete = false;
        },
        caculateCenterPoint(): number[] {
            const dx = (this.end[0] - this.start[0]) / 2;
            const dy = (this.end[1] - this.start[1]) / 2;
            return [this.start[0] + dx, this.start[1] + dy];
        },
        caculateRotation(): number {
            const angle = -Math.atan2(this.end[0] - this.start[0], this.end[1] - this.start[1]);
            const degree = (angle * 180) / Math.PI;
            return degree < 0 ? degree + 360 : degree;
        },
        deleteEdge(): void {
            this.$emit('deleteEdge', this.id);
        },
    },
});
</script>
