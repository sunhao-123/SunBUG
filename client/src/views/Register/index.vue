<template>
  <div class="bgBox">
    <div class="formContent">
      <div v-html="avatar" class="avtart-block"></div>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="昵称" prop="name">
          <el-input
            v-model="ruleForm.name"
            size="small"
            class="input"
            @input="changeInput"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="邮箱"
          prop="email"
          :rules="[
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change'],
            },
          ]"
        >
          <el-input
            placeholder="请输入邮箱"
            v-model="ruleForm.email"
            size="small"
          >
            <el-button
              slot="append"
              @click="sendCode"
              :disabled="!buttonTextEnable"
              >{{ buttonText }}</el-button
            >
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" size="small"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="ruleForm.password"
            size="small"
            class="input"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="ruleForm.sex" size="small">
            <el-radio label="GG"></el-radio>
            <el-radio label="MM"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个性签名" prop="signature">
          <el-input type="textarea" v-model="ruleForm.Signature"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            :disabled="!submitEnable"
            >注册</el-button
          >
          <el-button @click="resetForm">返回登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Register, sendCode } from "../../api";

import multiavatar from "@multiavatar/multiavatar";

export default {
  name: "Login",
  data() {
    return {
      // defaultPhoto.jpeg
      avatar: "<img src='/img/defaultPhoto.jpeg' style='border-radius: 50%;'>",
      buttonText: "发送验证码",
      buttonTextEnable: true,
      submitEnable: true,
      ruleForm: {
        name: "",
        email: "",
        code: "",
        password: "",
        sex: "",
        signature: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入您的昵称", trigger: "blur" },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur",
          },
        ],
        sex: [{ required: true, message: "请选择您的性别", trigger: "change" }],
        code: [{ required: true, message: "请填写验证码", trigger: "blur" }],
        password: [{ required: true, message: "请填写密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    changeInput(value) {
      if (value !== "") {
        this.avatar = multiavatar(value, false);
      } else {
        this.avatar =
          "<img src='/img/defaultPhoto.jpeg' style='border-radius: 50%;'>";
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          Register({
            svg: this.avatar,
            name: this.ruleForm.name,
            password: this.ruleForm.password,
            email: this.ruleForm.email,
            code: this.ruleForm.code,
            sex: this.ruleForm.sex,
            signature: this.ruleForm.signature
              ? this.ruleForm.signature
              : "这个人很懒，什么也没有留下~~",
          }).then((data) => {
            if (data.data.code !== 0) {
              this.$message({
                message: data.data.msg,
                type: "error",
              });
            } else {
              this.$message({
                message: data.data.msg,
                type: "success",
              });
              this.$router.push("/");
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    sendCode() {
      let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      let email = this.ruleForm.email;
      if (reg.test(email)) {
        this.buttonTextEnable = false;
        sendCode({ email }).then((data) => {
          if (data.data.code == 0) {
            this.$message({
              message: "验证码发送成功，有效期5分钟！",
              type: "success",
            });
            this.timer = setInterval(() => {
              if (this.buttonText == "发送验证码") {
                this.buttonText = "60s";
                this.buttonTextEnable = false;
              } else {
                this.buttonText =
                  this.buttonText.replace("s", "") * 1 - 1 + "s";
                this.buttonTextEnable = false;
                if (this.buttonText == "0s") {
                  this.buttonText = "发送验证码";
                  this.buttonTextEnable = true;
                  clearInterval(this.timer);
                }
              }
            }, 1000);
          } else {
            this.buttonTextEnable = true;
          }
        });
      } else {
        this.$alert("请输入正确的邮箱地址", "提示", {
          confirmButtonText: "确定",
        });
      }
    },
    resetForm() {
      this.$router.push("/");
    },
    // 登录
    signIn() {
      Login({ username: this.form.username, password: this.form.password })
        .then((res) => {
          console.log(res.data);
          if (res.data.code !== 0) {
            this.$message.error(res.data.msg);
          } else {
            this.$message.success(res.data.msg);
            // sessionStorage.setItem("uid", res.data.uid);
            // sessionStorage.setItem("username", res.data.username);
            this.$router.push("/musicRoom/888");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
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
<style scoped lang="less">
.bgBox {
  height: 100%;
  width: 100%;
  background: url("/img/building.jpg") center/cover;
  box-sizing: border-box;
  padding: 20px;
  line-height: 100%;
  display: flex;
  align-items: center;
  .formContent {
    width: 430px;
    height: 520px;
    background-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 0px 35px #fff;
    border-radius: 10px;
    margin: 0px auto;
    padding: 20px 0px 20px 0;
    .avtart-block {
      margin: 0 auto 10px;
      width: 80px;
      height: 80px;
      svg {
        margin-left: 25px;
      }
    }
  }
}

/deep/.el-input-group {
  margin-top: 4px;
}

/deep/.demo-ruleForm {
  padding-right: 25px;
}
</style>