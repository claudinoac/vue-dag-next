<template>
  <div class="vd__node" :style="nodePositionAndScale" @mousedown="$emit('selectNode', $event)">
    <div
      v-for="position in ['top', 'right', 'left', 'bottom']"
      :key="`link_${position}`"
      class="vd__node__link"
      :class="`vd__node__link--${position}`"
      @click="$emit('linkClick', position, id)"
    ></div>
    <slot>
      <div class="vd__node__default-content">Empty node</div>
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'dag-node',
    props: {
        scale: {
            type: Number,
            default: () => 1,
        },
        id: {
            type: Number,
            required: true,
        },
        x: {
            type: Number,
            required: true,
        },
        y: {
            type: Number,
            required: true,
        },
    },
    computed: {
        nodePositionAndScale(): { top: string, left: string, transform: string } {
            return {
                top: `${this.y * this.scale}px`,
                left: `${this.x * this.scale}px`,
                transform: `scale(${this.scale})`,
            };
        },
    },
});
</script>
