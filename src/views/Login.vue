<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="~assets/img/avatar.jpeg" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form label-width="0px" class="login_form" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <!-- 登录和重置按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {Login} from 'network/login';

export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      } 
    }
  },
  methods: {
    /* 表单重置 */
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    /* 登录 */
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid) return;
        const { data: res } = await Login(this.loginForm);
        if(res.meta.status !== 200) return this.$message.error("登录失败");
        this.$message.success("登录成功");
        // 保存token到sessionStorage
        window.sessionStorage.setItem('token', res.data.token);
        // 跳转到home页面
        this.$router.push('/home');
      });
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #76EAF5;
    height: 100%;
  }

  .login_box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;

    .avatar_box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;

      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ccc;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .btns {
      display: flex;
      justify-content: flex-end;
    }

</style>