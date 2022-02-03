<template>
  <div class="vd__container">
    <svg :width="width" :height="height">
      <slot name="edges" />
    </svg>

    <slot name="nodes"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'dag-container',
    props: {
        width: {
            type: String,
            default: '100%',
        },
        height: {
            type: String,
            default: '100%',
        },
    },
});
</script>
