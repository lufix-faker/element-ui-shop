<template>
  <div>
    <!-- 面包屑导航 -->
    <Breadcrumb>
      <template v-slot:firstItem>权限管理</template>
      <template v-slot:secondItem>角色列表</template>
    </Breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <!-- 角色列表 -->
      <el-table :data="rolesList" border stripe style="width: 100%">
        <!-- 拓展项 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['vcenter', 'bdbottom', index1 == 0 ? 'bdtop' : '']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['vcenter', index2 == 0 ? '' : 'bdtop']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引项 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditRoleDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRole(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      width="30%"
      @close="$refs.addRoleFormRef.resetFields()"
    >
      <!-- 主体部分 -->
      <el-form
        ref="addRoleFormRef"
        :model="addRoleForm"
        :rules="addRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="30%"
      @close="$refs.editRoleFormRef.resetFields()"
    >
      <!-- 主体部分 -->
      <el-form
        ref="editRoleFormRef"
        :model="editRoleForm"
        :rules="editRoleFormRules"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="editDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="30%"
    >
      <!-- 主体部分 -->
      <!-- 树形控件 -->
      <el-tree
        :data="rightsTree"
        :props="rightsTreeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="rightsTreeRef"
      ></el-tree>

      <!-- 底部部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "components/common/Breadcrumb";

import {
  getRolesList,
  addRole,
  getRoleMessageById,
  editRole,
  removeRoleById,
  removeRightById,
  getRightsList,
  allotRights,
} from "network/home.js";

export default {
  name: "Roles",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 添加角色对话框状态
      addRoleDialogVisible: false,
      // 添加角色表单
      addRoleForm: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色表单规则
      addRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },

      // 编辑角色对话框状态
      editRoleDialogVisible: false,
      // 编辑角色信息表单
      editRoleForm: {},
      // 编辑角色信息规则
      editRoleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },

      // 分配权限对话框状态
      setRightsDialogVisible: false,
      // 权限列表树
      rightsTree: [],
      // 树形控件的属性绑定
      rightsTreeProps: {
        // 显示的字段名
        label: "authName",
        // 嵌套的属性名
        children: "children",
      },
      // 默认选中的结点数组
      defKeys: [105, 116],
      // 当前分配权限角色的id
      roleId: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    /* 获取角色列表 */
    async getRolesList() {
      const { data: res } = await getRolesList();
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败！");
      this.rolesList = res.data;
    },
    /* 添加角色 */
    addRole() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await addRole(this.addRoleForm);
        if (res.meta.status !== 201)
          return this.$message.error("添加角色失败！");
        // 添加角色成功
        this.$message.success("添加用户成功！");
        // 关闭对话框
        this.addRoleDialogVisible = false;
        // 刷新角色列表
        this.getRolesList();
      });
    },

    /* 编辑角色对话框 */
    async showEditRoleDialog(id) {
      const { data: res } = await getRoleMessageById(id);
      if (res.meta.status !== 200)
        return this.$message.error("获取角色信息失败！");
      // 查询成功
      this.editRoleForm = res.data;
      // 显示对话框
      this.editRoleDialogVisible = true;
    },
    /* 确认编辑角色 */
    editRole() {
      this.$refs.editRoleFormRef.validate(async (valid) => {
        if (!valid) return;
        // 验证成功
        const { data: res } = await editRole(this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc,
        });
        console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("编辑角色失败！");

        // 编辑成功
        // 关闭对话框
        this.editRoleDialogVisible = false;
        // 刷新角色列表
        this.getRolesList();
        // 提示成功
        this.$message.success("编辑角色成功！");
      });
    },

    /* 删除角色 */
    removeRole(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发起删除请求
          const { data: res } = await removeRoleById(id);
          if (res.meta.status !== 200)
            return this.$message.error("删除角色失败！");
          // 删除成功
          this.$message.success("删除角色成功!");
          // 刷新角色列表
          this.getRolesList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    /* 根据id删除权限 */
    removeRightById(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发送删除权限请求
          const { data: res } = await removeRightById(role.id, rightId);
          if (res.meta.status !== 200)
            return this.$message.error("删除权限失败！");
          // 删除成功
          // 直接更新动态数据，不刷新页面
          role.children = res.data;

          // 提示成功
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
    /* 分配权限对话框 */
    async showSetRightsDialog(role) {
      // 存储当前角色的id
      this.roleId = role.id;

      // 发送查询权限的请求
      const { data: res } = await getRightsList("tree");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败！");
      // 获取成功
      this.rightsTree = res.data;

      // 获取所有三级权限
      this.defKeys = [];
      this.getThirdRights(role, this.defKeys);

      this.setRightsDialogVisible = true;
    },
    /* 获取三级权限 */
    getThirdRights(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      // 递归调用
      node.children.forEach((item) => this.getThirdRights(item, arr));
    },
    /* 点击确认分配权限 */
    async allotRights() {
      // 获取节点和半节点的数组
      const arr = [
        ...this.$refs.rightsTreeRef.getCheckedKeys(),
        ...this.$refs.rightsTreeRef.getHalfCheckedKeys(),
      ];
      // 把数组转化为字符串
      const idStr = arr.join(",");

      // 发送请求
      const { data: res } = await allotRights(this.roleId, { rids: idStr });
      console.log(res);
      if (res.meta.status !== 200) return this.$message.error("分配权限失败！");
      // 分配成功
      this.getRolesList();
      this.$message.success("分配权限成功！");
      // 关闭对话框
      this.setRightsDialogVisible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>

