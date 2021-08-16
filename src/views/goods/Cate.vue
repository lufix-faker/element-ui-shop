<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:firstItem>商品管理</template>
      <template v-slot:secondItem>商品分类</template>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="treeTableColumns"
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        border
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-success"
            style="color: lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template v-slot:sort="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="danger" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template v-slot:option="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditCateDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 主体部分 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="parentCateProps"
            clearable
            @change="parentCateChange"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog
      title="修改分类"
      :visible.sync="editCateDialogVisible"
      width="50%"
    >
      <!-- 主体部分 -->
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateList,
  addCate,
  getCateById,
  editCate,
  removeCate,
} from "network/home.js";

import Breadcrumb from "components/common/Breadcrumb";

export default {
  name: "Cate",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 商品数据
      cateList: [],
      // 查询商品数据的参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品总条数
      total: 0,

      // 树状表格列名
      treeTableColumns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板列的名称
          template: "isok",
        },
        {
          label: "排序",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板列的名称
          template: "sort",
        },
        {
          label: "操作",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板列的名称
          template: "option",
        },
      ],

      // 添加分类对话框状态
      addCateDialogVisible: false,
      // 添加分类表单
      addCateForm: {
        // 分类名称
        cat_name: "",
        // 父级id
        cat_pid: 0,
        // 分类层级
        cat_level: 0,
      },
      // 添加分类表单规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类数据
      parentCateList: [],
      // 选中的父级分类
      selectedKeys: [],
      // 级联选择器配置
      parentCateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        // 可选任意一级
        checkStrictly: true,
      },

      // 编辑分类对话框状态
      editCateDialogVisible: false,
      // 编辑分类表单
      editCateForm: {},
      // 编辑分类表单规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    // 立即加载商品数据
    this.getCateList();
  },
  methods: {
    // 获取商品数据
    async getCateList() {
      const { data: res } = await getCateList(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品数据失败！");
      }
      // 获取数据成功
      this.cateList = res.data.result;
      this.total = res.data.total;
    },

    // 分页
    // 监听pagesize改变
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum改变
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current;
      this.getCateList();
    },

    // 添加分类对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 添加分类对话框关闭
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await getCateList({ type: 2 });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类数据失败！");
      }
      // 获取成功
      this.parentCateList = res.data;
    },
    // 父级分类级联选择器发生改变
    parentCateChange() {
      const n = this.selectedKeys.length;
      if (n > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[n - 1];
        this.addCateForm.cat_level = n;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    // 确认添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        // 验证成功
        const { data: res } = await addCate(this.addCateForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加分类失败！");
        }
        // 添加成功
        this.$message.success("添加分类成功！");
        this.getCateList();
        this.addCateDialogVisible = false;
      });
    },

    // 编辑分类对话框显示
    async showEditCateDialog(id) {
      const { data: res } = await getCateById(id);
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类信息失败！");
      }
      // 获取成功
      this.editCateForm = res.data;
      this.editCateDialogVisible = true;
    },
    // 确认编辑分类
    editCate() {
      this.$refs.editCateFormRef.validate(async (valid) => {
        if (!valid) return;
        // 验证成功
        const { data: res } = await editCate(this.editCateForm.cat_id, {
          cat_name: this.editCateForm.cat_name,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("编辑分类失败！");
        }
        // 编辑成功
        this.$message.success("编辑分类成功！");
        this.getCateList();
        this.editCateDialogVisible = false;
      });
    },
    // 删除分类
    removeCate(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除请求
          const { data: res } = await removeCate(id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除分类失败！");
          }
          // 删除成功
          this.$message.success("删除分类成功！");
          this.getCateList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>