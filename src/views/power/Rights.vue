<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:firstItem>权限管理</template>
      <template v-slot:secondItem>权限列表</template>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 权限列表 -->
      <el-table :data="rightsList" border style="width: 100%" stripe>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import Breadcrumb from "components/common/Breadcrumb.vue";

import { getRightsList } from "network/home.js";

export default {
  name: "Rights",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    // 获取所有权限列表
    this.getRightsList("list");
  },
  methods: {
    async getRightsList(type) {
      const { data: res } = await getRightsList(type);
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败！");
      this.rightsList = res.data;
    },
  },
};
</script>

<style lang="less" scoped>
</style>