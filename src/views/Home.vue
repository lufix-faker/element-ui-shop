<template>
  <el-container class="home-container">
    <!-- 标题部分 -->
    <el-header>
      <div>
        <img src="~assets/img/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 折叠按钮 -->
        <div class="collapseBtn" @click="toggleCollapse">|||</div>
        <!-- 导航菜单 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#587A82"
          text-color="#eee"
          active-text-color="#00CAFC"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menusList" :key="item.id">
            <!-- 样式模板 -->
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ subitem.authName }}</span>
            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 主体部分 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenusList } from 'network/home.js'

export default {
  name: "Home",
  data() {
    return {
      /* 左侧菜单数据列表 */
      menusList: [],
      /* 左侧菜单字体图标 */
      iconsObj: {
        '125': 'el-icon-user-solid',
        '103': 'el-icon-lock',
        '101': 'el-icon-s-goods',
        '102': 'el-icon-s-order',
        '145': 'el-icon-data-analysis'
      },
      /* 左侧菜单折叠状态 */
      isCollapse: false
    }
  },
  created() {
    this.getMenusList();
  },
  methods: {
    /* 登出用户 */
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    /* 获取左侧列表数组 */
    async getMenusList() {
      const { data: res } = await getMenusList();
      if(res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menusList = res.data;
      console.log(this.menusList);
    },
    /* 改变左侧菜单折叠状态 */
    toggleCollapse() {
      console.log(11);
      this.isCollapse = !this.isCollapse;
    }
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
// 顶部
.el-header {
  background-color: #587A82;
  display: flex;
  justify-content: space-between;
  padding-left: 5px;
  align-items: center;
  color: #eee;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;
    height: 100%;

    > img {
      height: 100%;
    }
  }
}
// 左侧菜单
.el-aside {
  background-color: #587A82;
  .collapseBtn {
    background-color: #aaa;
    font-size: 14px;
    line-height: 24px;
    color: #eee;
    text-align: center;
    letter-spacing: 3px;
    cursor: pointer;
  }
  // 取消右边框突出1px
  .el-menu {
    border-right: none;
  }
}


// 主体部分
.el-main {
  background-color: #f6f6f6;
}
</style>