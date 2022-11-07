<template>
  <a :title="title" style="margin:10px">
    <el-button v-bind="$attrs" v-on="$listeners"></el-button>
  </a>
</template>

<script>
export default {
  //二次封装好的按钮组件
  //全局组件
  name: "HintButton",
  props: ["title"]
  // 标题由父组件传过来
};
</script>

<style scoped>
</style>
