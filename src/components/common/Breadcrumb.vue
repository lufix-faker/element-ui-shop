<template>
  <!-- 面包屑导航 -->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><slot name="firstItem"></slot></el-breadcrumb-item>
    <el-breadcrumb-item><slot name="secondItem"></slot></el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "Breadcrumb",
};
</script>

<style lang="less" scoped>
</style>