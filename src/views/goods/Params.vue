<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:firstItem>商品管理</template>
      <template v-slot:secondItem>分类参数</template>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>

          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleCateChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页区域 -->
      <el-tabs v-model="activeTabName" @tab-click="handleTabsClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
            >添加参数</el-button
          >
          <!-- 表格区域 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开项 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 已存在标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleTagClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 新增标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.newTagInputVisible"
                  v-model="scope.row.newTagInputValue"
                  ref="newTagInputRef"
                  size="small"
                  @keyup.enter.native="handleNewTag(scope.row)"
                  @blur="handleNewTag(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showNewTagInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引项 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeAttribute(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="showAddDialog"
            >添加属性</el-button
          >
          <!-- 表格区域 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开项 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <!-- 已存在标签 -->
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleTagClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 新增标签 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.newTagInputVisible"
                  v-model="scope.row.newTagInputValue"
                  ref="newTagInputRef"
                  size="small"
                  @keyup.enter.native="handleNewTag(scope.row)"
                  @blur="handleNewTag(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showNewTagInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引项 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="removeAttribute(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @keyup.enter.native="addAttribute"
      @close="addDialogClosed"
    >
      <!-- 主体部分 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAttribute">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @keyup.enter.native="editAttribute"
      @close="editDialogClosed"
    >
      <!-- 主体部分 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAttribute">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateList,
  getAttributes,
  addAttribute,
  getAttributesById,
  editAttribute,
  removeAttribute,
} from "network/home";

import Breadcrumb from "components/common/Breadcrumb";

export default {
  name: "Params",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 商品分类数据
      cateList: [],
      // 级联选择器配置参数
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      // 级联选择器选择的内容
      selectedCateKeys: [],

      // 当前标签页
      activeTabName: "many",

      // 静态参数列表
      onlyTableData: [],
      // 动态参数列表
      manyTableData: [],

      // 添加对话框状态
      addDialogVisible: false,
      // 添加对话框表单
      addForm: {
        attr_name: "",
      },
      // 添加对话框表单规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },

      // 修改对话框状态
      editDialogVisible: false,
      // 修改对话框表单
      editForm: {},
      // 修改对话框表单规则
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 禁用按钮
    isBtnDisabled() {
      return this.selectedCateKeys.length !== 3;
    },
    // 所选商品分类的id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    // 添加对话框标题
    titleText() {
      if (this.activeTabName == "only") {
        return "静态属性";
      } else {
        return "动态参数";
      }
    },
  },
  methods: {
    // 获取商品分类数据
    async getCateList() {
      const { data: res } = await getCateList();
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类数据失败！");
      }
      // 获取成功
      this.cateList = res.data;
    },
    // 监听级联选择器改变
    handleCateChange() {
      // 获取参数列表
      this.getAttributes();
    },
    // 监听标签页切换
    handleTabsClick() {
      this.getAttributes();
    },
    // 获取参数列表
    async getAttributes() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTableData = [];
        this.onlyTableData = [];
        return;
      }

      const { data: res } = await getAttributes(this.cateId, {
        sel: this.activeTabName,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取参数列表失败！");
      }
      // 获取成功
      // 处理数据
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 新增标签输入框状态
        item.newTagInputVisible = false;
        // 新增标签输入框内容
        item.newTagInputValue = "";
      });

      // 判断是静态还是动态参数的数据
      if (this.activeTabName == "only") {
        this.onlyTableData = res.data;
      } else {
        this.manyTableData = res.data;
      }
    },

    // 添加对话框显示
    showAddDialog() {
      this.addDialogVisible = true;
    },
    // 添加对话框关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 确认添加参数、属性
    addAttribute() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 验证成功
        const { data: res } = await addAttribute(this.cateId, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeTabName,
        });
        if (res.meta.status !== 201) {
          return this.$message.error("添加参数失败！");
        }
        // 添加成功
        this.$message.success("添加参数成功！");
        this.addDialogVisible = false;
        this.getAttributes();
      });
    },

    // 修改对话框展示
    async showEditDialog(row) {
      // 发起根据id查询请求
      const { data: res } = await getAttributesById(row.cat_id, row.attr_id, {
        attr_sel: this.activeTabName,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("查询属性信息失败！");
      }
      // 查询成功
      this.editForm = res.data;

      this.editDialogVisible = true;
    },
    // 确认修改参数、属性
    editAttribute() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 验证成功
        const { data: res } = await editAttribute(
          this.editForm.cat_id,
          this.editForm.attr_id,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.editForm.attr_sel,
            attr_vals: this.editForm.attr_vals
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改参数失败！");
        }
        // 修改成功
        this.$message.success("修改参数成功！");
        this.editDialogVisible = false;
        this.getAttributes();
      });
    },
    // 修改对话框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },

    // 删除参数、属性
    removeAttribute(row) {
      this.$confirm("此操作将永久删除该参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除请求
          const { data: res } = await removeAttribute(row.cat_id, row.attr_id);
          if (res.meta.status !== 200) {
            return this.$message.error("删除参数失败！");
          }

          // 删除成功
          this.getAttributes();
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 显示新增标签输入框
    showNewTagInput(row) {
      row.newTagInputVisible = true;
      // $nextTick作用：当页面上元素被重新渲染后，才会执行回调函数的代码
      this.$nextTick((_) => {
        this.$refs.newTagInputRef.$refs.input.focus();
      });
    },
    // 新增标签
    async handleNewTag(row) {
      // 空则重置
      if (row.newTagInputValue.trim().length === 0) {
        row.newTagInputValue = "";
        row.newTagInputVisible = false;
        return;
      }
      // 存入当前页面的参数项
      row.attr_vals.push(row.newTagInputValue);
      // 正常隐藏
      row.newTagInputValue = "";
      row.newTagInputVisible = false;

      // 发起修改参数项请求
      this.saveAttrVals(row);
    },
    // 保存修改后的参数项到数据库
    async saveAttrVals(row) {
      const { data: res } = await editAttribute(row.cat_id, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" "),
      });
      if (res.meta.status !== 200) {
        return this.$message.error("修改参数项失败！");
      }
      // 新增成功
      this.$message.success("修改参数项成功！");
    },
    // 删除已存在标签
    handleTagClose(index, row) {
      row.attr_vals.splice(index, 1);
      // 发起修改参数项请求
      this.saveAttrVals(row);
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}

.el-tag {
  margin: 5px;
}

.input-new-tag {
  margin: 5px;
  width: 150px;
}

.button-new-tag {
  margin: 5px;
}
</style>