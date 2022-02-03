<template>
  <div class="example-node">
    <h1>Example Custom Component Node {{ exampleProp }}</h1>

    <span @click="$emit('edit')">✏️ Edit</span>
    <span class="pull-right" @click="$emit('delete')">❌ Delete</span>
  </div>
</template>

<style lang="scss" scoped>
.example-node {
  padding: 5px;
}
.pull-right {
  float: right;
}

h1 {
    font-size: 12px;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        exampleProp: {
            type: String,
            required: true,
        },
    },
});
</script>
