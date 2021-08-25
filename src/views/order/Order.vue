<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:firstItem>订单管理</template>
      <template v-slot:secondItem>订单列表</template>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="ordersList" border stripe>
        <!-- 索引项 -->
        <el-table-column type="index"></el-table-column>
        <!-- 订单编号 -->
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <!-- 订单价格 -->
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <!-- 是否付款 -->
        <el-table-column label="是否付款" prop="pay_status">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <!-- 是否发货 -->
        <el-table-column label="是否发货" prop="is_send">
          <template v-slot="scope">
            {{ scope.row.is_send }}
          </template>
        </el-table-column>
        <!-- 下单时间 -->
        <el-table-column label="下单时间" prop="create_time">
          <template v-slot="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressDialog(scope.row.order_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[3, 5, 10, 15]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑地址对话框区域 -->
    <el-dialog
      title="修改地址"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体区域 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="editForm.address1"
            :options="cityData"
            :props="{ expandTrigger: 'hover' }"
            @change="handleSelectedChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editForm.address2"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查询物流进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressDialogVisible"
      width="50%"
    >
    <!-- 时间线 -->
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in progressList"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrdersList, getProgress } from "network/home.js";

import Breadcrumb from "components/common/Breadcrumb";

import cityData from "./cityData";

export default {
  name: "Order",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 获取订单列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      // 订单列表
      ordersList: [],

      // 编辑地址对话框状态
      editDialogVisible: false,
      // 编辑地址对话框表单
      editForm: {
        address1: [],
        address2: "",
      },
      // 编辑地址对话框表单规则
      editFormRules: {
        address1: [
          { required: true, message: "请输入省市区/县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      // 城市代码
      cityData,

      // 物流进度对话框状态
      progressDialogVisible: false,
      // 物流进度列表
      progressList: [],
    };
  },
  created() {
    // 获取订单列表
    this.getOrdersList();
  },
  methods: {
    // 获取订单列表
    async getOrdersList() {
      const { data: res } = await getOrdersList(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败！");
      }
      // 获取成功
      this.total = res.data.total;
      this.ordersList = res.data.goods;
    },
    // 分页-显示条数改变
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getOrdersList();
    },
    // 分页-当前页码改变
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current;
      this.getOrdersList();
    },

    // 编辑地址对话框显示
    showEditDialog() {
      this.editDialogVisible = true;
    },
    // 编辑地址对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 级联选择器发生改变
    handleSelectedChange() {},

    // 物流进度对话框显示
    async showProgressDialog(id) {
      console.log(id);
      // 发起查询请求
      const { data: res } = await getProgress("1106975712662");
      if (res.meta.status !== 200) {
        return this.$message.error("查询物流进度失败！");
      }
      // 查询成功
      this.progressList = res.data;
      console.log(this.progressList);

      this.progressDialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>