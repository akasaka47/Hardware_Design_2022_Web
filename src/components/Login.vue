<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域-->
      <div class="avatat_box">
        <img src="../assets/login_eic.png" alt="" />
      </div>
      <h2 class="title">室内RSS指纹定位可视化系统</h2>
      <!-- 登录表单区域-->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="success" icon="el-icon-check" @click="login"
            >登录</el-button
          >
          <el-button type="primary" icon="el-icon-plus" @click="signupLoginForm"
            >注册</el-button
          >
          <el-button
            type="info"
            icon="el-icon-refresh-right"
            @click="resetLoginForm"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- 注册对话框 -->
    <el-dialog
      title="注册新用户"
      :visible.sync="signupDialogFormVisible"
      width="30%"
    >
      <el-form
        ref="loginFormRef"
        label-position="right"
        label-width="80px"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-s-custom"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="loginForm.email"
            prefix-icon="el-icon-paperclip"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" icon="el-icon-plus" @click="signup"
            >注册</el-button
          >
          <el-button
            type="info"
            icon="el-icon-refresh-right"
            @click="resettLoginForm"
            >取消</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>



<script>
export default {
  data() {
    // 邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (!value) {
        return callback(new Error("邮箱不能为空"));
      }
      setTimeout(() => {
        if (mailReg.test(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的邮箱格式"));
        }
      }, 100);
    };
    return {
      // 登录表单的数据绑定对象
      loginForm: {
        username: "",
        password: "",
      },
      // 表单验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [{ required: true, trigger: "blur", validator: checkEmail }],
      },
      signupDialogFormVisible: false,
      formLabelWidth: "80px",
    };
  },
  methods: {
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        var that = this;
        const { data: res } = await this.$axios
          .post("login", this.loginForm)
          .catch(function (error) {
            that.$message.error("服务器出错");
          });
        if (res.meta.status !== 200) return this.$message.error("登录失败");
        if (res.meta.status === 200) {
          this.$message({
            message: "登录成功",
            type: "success",
          });
          // 将token保存在客户端的sessionStorage中
          window.sessionStorage.setItem("token", "Bearer " + res.token);
          // 跳转到/home
          this.$router.push("/home");
        }
      });
    },
    // 重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 打开用户注册对话框
    signupLoginForm() {
      this.signupDialogFormVisible = true;
    },
    // 取消用户注册
    resettLoginForm() {
      this.$refs.loginFormRef.resetFields();
      this.signupDialogFormVisible = false;
      this.$message("已取消注册");
    },
    // 用户注册
    signup() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        var that = this;
        const { data: res } = await this.$axios
          .post("signup", this.loginForm)
          .catch(function (error) {
            that.$message.error("服务器出错");
          });
        if (res.meta.status === 200) {
          this.$message({
            message: "注册成功",
            type: "success",
          });
          this.login();
        }
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_container {
  background-image: url("../assets/LoginBackground.png");
  background-size: 100% 100%;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 350px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  //位置置于中央
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  // 标题
  .title {
    color: #fff;
    width: 100%;
    text-align: center;
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%, -50%);
  }
  //绘制头像
  .avatat_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      //border-radius: 50%;
    }
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.iconfont {
  margin-right: 10px;
}

.signup_form {
  // position: absolute;
  // bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  margin-top: 5px;
}
</style>