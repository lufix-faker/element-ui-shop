<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:firstItem>商品管理</template>
      <template v-slot:secondItem>商品列表</template>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <!-- 搜索框区域 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入商品名称"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品按钮区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="goToAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引项 -->
        <el-table-column type="index"></el-table-column>
        <!-- 参数项 -->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格（元）"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="70px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160px">
          <!-- 格式化时间 -->
          <template v-slot="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, removeGoodById } from "network/home.js";

import Breadcrumb from "components/common/Breadcrumb";

export default {
  name: "List",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 商品列表数据
      goodsList: [],
      // 商品总条数
      total: 0,
    };
  },
  created() {
    // 获取商品列表
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await getGoodsList(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("查询商品列表失败！");
      }
      // 查询成功
      this.goodsList = res.data.goods;
      this.total = res.data.total;
      console.log(this.goodsList);
    },
    // 分页-显示条数改变
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getGoodsList();
    },
    // 分页-换页
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current;
      this.getGoodsList();
    },

    // 根据商品id删除商品
    removeGoodById(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          // 发起删除请求
          const {data: res} = await removeGoodById(id);
          if(res.meta.status !== 200) {
            return this.$message.error('删除商品失败！');
          }
          // 删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.getGoodsList();

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },

    // 跳转添加商品页面
    goToAddPage() {
      this.$router.push('/goods/add');
    }
  },
};
</script>

<style scoped>
</style>