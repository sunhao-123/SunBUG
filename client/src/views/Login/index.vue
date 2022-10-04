<template>
  <div class="htmleaf-container">
    <div class="wrapper">
      <div class="container">
        <h1>SunBug 音乐聊天室</h1>
        <div class="formBox">
          <el-form :model="form" :rules="rules">
            <el-form-item label="用户名" prop="username">
              <el-input
                placeholder="请输入内容"
                v-model="form.username"
                clearable
                @keyup.enter.native="signIn"
              ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                placeholder="请输入密码"
                v-model="form.password"
                clearable
                show-password
                @keyup.enter.native="signIn"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" plain @click="signIn">登录</el-button>
              <el-button plain @click="gotoRegister">先去注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Login, ifLogin } from "../../api";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
      rules: {
        //用户名验证
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            //数据类型
            type: "string",
            //正则规则
            pattern: /^[\w\u4e00-\u9fa5\uac00-\ud7ff\u0800-\u4e00\-]{1,7}$/,
            message: "请输入正确格式用户名",
            trigger: ["blur", "change"],
          },
        ],

        //密码验证
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            type: "string",
            pattern: /^[\w<>,.?|;':"{}!@#$%^&*()\/\-\[\]\\]{1,18}$/,
            message: "请输入正确格式用户名",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  methods: {
    // 登录
    signIn() {
      Login({ username: this.form.username, password: this.form.password })
        .then((res) => {
          console.log(res.data)
          if (res.data.code !== 0) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            // sessionStorage.setItem("uid", res.data.uid);
            // sessionStorage.setItem("username", res.data.username);
            this.$router.push('/musicRoom/888');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    gotoRegister(){
      this.$router.push('/register');
    }
    //  注册
    // signUp () {
    //   this.dialogFormVisible = false
    //   this.$http
    //     .post('/user/add', this.form)
    //     .then(res => {
    //       if (res.data.flag === 0) {
    //         this.$message.error(res.data.msg)
    //       } else {
    //         this.$message.success(res.data.msg)
    //         this.$router.push('tab-list')
    //       }
    //     })
    //     .catch(err => {
    //       console.log(err)
    //     })
    // }
  },
  mounted() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.not5 {
  width: 100%;
  height: 100px;
  font-size: 30px;
  line-height: 100px;
  text-align: center;
  font-weight: bold;
}
.wrapper {
  background: #50a3a2;
  background: -webkit-linear-gradient(top left, #50a3a2 0%, #53e3a6 100%);
  background: linear-gradient(to bottom right, #50a3a2 0%, #53e3a6 100%);
  opacity: 0.8;
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 400px;
  margin-top: -200px;
  overflow: hidden;
}
.container {
  position: relative;
  box-sizing: border-box;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 0;
  height: 400px;
  text-align: center;
  z-index: 99999;
}
.formBox {
  margin: 0 auto;
  width: 300px;
}
.container h1 {
  font-size: 40px;
  transition-duration: 1s;
  transition-timing-function: ease-in-put;
  font-weight: 200;
  color: #fff;
}
.container .el-form .el-form-item {
  margin-bottom: 0px;
}
.container .el-form .el-form-item .el-form-item__content {
  margin-top: 30px;
}
.container .el-form .el-form-item .el-form-item__label {
  color: #fff;
}
.container .el-form .el-form-item .el-button + .el-button {
  margin-left: 40px;
  margin-top: 40px;
}
</style>