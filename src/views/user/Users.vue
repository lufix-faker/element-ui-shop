<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUsersList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表显示区域 -->
      <el-table :data="usersList" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStatusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220px">
          <template v-slot="scope">
            <!-- 编辑操作 -->
            <el-tooltip
              effect="dark"
              content="编辑用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 删除操作 -->
            <el-tooltip
              effect="dark"
              content="删除用户"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="removeUserById(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <!-- 分配角色操作 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="showSetRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addUserDialogClosed"
    >
      <!-- 主体内容 -->
      <el-form
        ref="addUserFormRef"
        :model="addUserForm"
        :rules="addUserFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部选项 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 主体内容 -->
      <el-form
        ref="editUserFormRef"
        :model="editUserForm"
        :rules="editUserFormRules"
        label-width="80px"
      >
        <el-form-item label="用户名称">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部选项 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="30%" @close="selectedRoleId = ''">
      <!-- 主体部分 -->
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部部分 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsersList,
  changeUserStatus,
  addUser,
  getUserMessageById,
  changeUserMessage,
  removeUserById,
  getRolesList,
  allotRole,
} from "network/home.js";

export default {
  name: "Users",
  data() {
    // 邮箱规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback();
      }
      return callback(new Error("请输入合法的邮箱"));
    };

    // 电话规则
    var checkMobile = (rule, value, callback) => {
      // 验证电话的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        // 合法的电话
        return callback();
      }
      return callback(new Error("请输入合法的电话号码"));
    };

    return {
      // 用户列表查询参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      // 用户数据
      usersList: [],
      // 总用户数据条数
      total: 0,

      // 添加用户对话框显示状态
      addDialogVisible: false,
      // 添加用户数据
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户规则
      addUserFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话号码", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 修改用户信息对话框显示状态
      editDialogVisible: false,
      // 修改用户信息数据
      editUserForm: {},
      // 修改用户信息规则
      editUserFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },

      // 分配角色对话框状态
      setRoleDialogVisible: false,
      // 当前角色数据
      userInfo: [],
      // 所有角色的数据列表
      rolesList: [],
      // 被选中的新角色id
      selectedRoleId: "",
    };
  },
  created() {
    this.getUsersList();
  },
  methods: {
    /* 显示用户列表 */
    async getUsersList() {
      const { data: res } = await getUsersList(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(this.meta.msg);
      this.usersList = res.data.users;
      this.total = res.data.total;
    },
    /* 用户状态改变 */
    async userStatusChange(row) {
      const { data: res } = await changeUserStatus(row.id, row.mg_state);
      if (res.meta.status !== 200) {
        userList.mg_state = !userList.mg_state;
        return this.$message.error("修改用户状态失败！");
      }
      return this.$message.success("修改用户状态成功！");
    },

    /* 分页-显示条数改变 */
    handleSizeChange(size) {
      this.queryInfo.pagesize = size;
      this.getUsersList();
    },
    /* 分页-当前页码改变 */
    handleCurrentChange(current) {
      this.queryInfo.pagenum = current;
      this.getUsersList();
    },

    /* 添加用户对话框关闭 */
    addUserDialogClosed() {
      this.$refs.addUserFormRef.resetFields();
    },
    /* 添加用户 */
    addUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) return;
        // 校验成功，则执行以下代码
        const { data: res } = await addUser(this.addUserForm);
        if (res.meta.status != 201) {
          return this.$message.error("添加用户失败！");
        }
        this.$message.success("添加用户成功！");
        // 关闭对话框
        this.addDialogVisible = false;
        // 重新获取用户列表
        this.getUsersList();
      });
    },

    /* 展示修改用户信息对话框 */
    async showEditDialog(id) {
      const { data: res } = await getUserMessageById(id);
      if (res.meta.status !== 200)
        return this.$message.error("查询用户信息失败！");
      // 查询成功，执行以下代码
      this.editUserForm = res.data;

      this.editDialogVisible = true;
    },
    /* 关闭修改用户信息对话框 */
    editDialogClosed() {
      this.$refs.editUserFormRef.resetFields();
    },
    /* 确认修改用户信息 */
    editUser() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) return;
        // 验证成功执行以下代码
        const { data: res } = await changeUserMessage(this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile,
        });
        if (res.meta.status !== 200)
          return this.$message.error("更新用户信息失败！");

        // 更新用户信息成功
        // 关闭对话框
        this.editDialogVisible = false;
        // 更新用户列表
        this.getUsersList();
        // 提示成功
        this.$message.success("更新用户信息成功！");
      });
    },

    /* 删除用户提示框 */
    removeUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 发起删除用户请求
          const { data: res } = await removeUserById(id);
          if (res.meta.status !== 200)
            return this.$message.error("删除用户失败！");

          this.$message({
            type: "success",
            message: "删除成功!",
          });

          // 刷新用户列表
          this.getUsersList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    /* 分配角色对话框显示 */
    async showSetRole(role) {
      // 显示当前用户的角色
      this.userInfo = role;

      // 获取所有角色的数据列表
      const { data: res } = await getRolesList();
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      // 获取成功
      this.rolesList = res.data;

      this.setRoleDialogVisible = true;
    },
    /* 确认分配角色 */
    async setRole() {
      if (!this.selectedRoleId) {
        return this.$message.error("请选择您要分配的角色！");
      }

      // 发起请求
      const { data: res } = await allotRole(this.userInfo.id, {
        rid: this.selectedRoleId,
      });
      if(res.meta.status !== 200) {
        return this.$message.error('分配角色失败！');
      }
      // 分配角色成功
      this.$message.success('分配角色成功！');
      // 更新用户列表
      this.getUsersList();

      // 关闭对话框
      this.setRoleDialogVisible = false;
    },
  },
};
</script>

<style lang='less' scoped>
</style>