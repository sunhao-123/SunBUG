(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-92a7f8de"],{"859b":function(e,t,r){"use strict";var s=r("f87c"),a=r.n(s);a.a},cc4d:function(e,t,r){"use strict";r.r(t);var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"bgBox"},[r("div",{staticClass:"formContent"},[r("div",{staticClass:"avtart-block",domProps:{innerHTML:e._s(e.avatar)}}),r("el-form",{ref:"ruleForm",staticClass:"demo-ruleForm",attrs:{model:e.ruleForm,rules:e.rules,"label-width":"100px"}},[r("el-form-item",{attrs:{label:"昵称",prop:"name"}},[r("el-input",{staticClass:"input",attrs:{size:"small"},on:{input:e.changeInput},model:{value:e.ruleForm.name,callback:function(t){e.$set(e.ruleForm,"name",t)},expression:"ruleForm.name"}})],1),r("el-form-item",{attrs:{label:"邮箱",prop:"email",rules:[{required:!0,message:"请输入邮箱地址",trigger:"blur"},{type:"email",message:"请输入正确的邮箱地址",trigger:["blur","change"]}]}},[r("el-input",{attrs:{placeholder:"请输入邮箱",size:"small"},model:{value:e.ruleForm.email,callback:function(t){e.$set(e.ruleForm,"email",t)},expression:"ruleForm.email"}},[r("el-button",{attrs:{slot:"append",disabled:!e.buttonTextEnable},on:{click:e.sendCode},slot:"append"},[e._v(e._s(e.buttonText))])],1)],1),r("el-form-item",{attrs:{label:"验证码",prop:"code"}},[r("el-input",{attrs:{size:"small"},model:{value:e.ruleForm.code,callback:function(t){e.$set(e.ruleForm,"code",t)},expression:"ruleForm.code"}})],1),r("el-form-item",{attrs:{label:"密码",prop:"password"}},[r("el-input",{staticClass:"input",attrs:{size:"small"},model:{value:e.ruleForm.password,callback:function(t){e.$set(e.ruleForm,"password",t)},expression:"ruleForm.password"}})],1),r("el-form-item",{attrs:{label:"性别",prop:"sex"}},[r("el-radio-group",{attrs:{size:"small"},model:{value:e.ruleForm.sex,callback:function(t){e.$set(e.ruleForm,"sex",t)},expression:"ruleForm.sex"}},[r("el-radio",{attrs:{label:"GG"}}),r("el-radio",{attrs:{label:"MM"}})],1)],1),r("el-form-item",{attrs:{label:"个性签名",prop:"signature"}},[r("el-input",{attrs:{type:"textarea"},model:{value:e.ruleForm.Signature,callback:function(t){e.$set(e.ruleForm,"Signature",t)},expression:"ruleForm.Signature"}})],1),r("el-form-item",[r("el-button",{attrs:{type:"primary",disabled:!e.submitEnable},on:{click:function(t){return e.submitForm("ruleForm")}}},[e._v("注册")]),r("el-button",{on:{click:e.resetForm}},[e._v("返回登陆")])],1)],1)],1)])},a=[],o=(r("b0c0"),r("ac1f"),r("5319"),r("365c")),l=r("c301"),n={name:"Login",data:function(){return{avatar:"<img src='/img/defaultPhoto.jpeg' style='border-radius: 50%;'>",buttonText:"发送验证码",buttonTextEnable:!0,submitEnable:!0,ruleForm:{name:"",email:"",code:"",password:"",sex:"",signature:""},rules:{name:[{required:!0,message:"请输入您的昵称",trigger:"blur"},{min:1,max:10,message:"长度在 1 到 10 个字符",trigger:"blur"}],sex:[{required:!0,message:"请选择您的性别",trigger:"change"}],code:[{required:!0,message:"请填写验证码",trigger:"blur"}],password:[{required:!0,message:"请填写密码",trigger:"blur"}]}}},methods:{changeInput:function(e){this.avatar=""!==e?Object(l["a"])(e,!1):"<img src='/img/defaultPhoto.jpeg' style='border-radius: 50%;'>"},submitForm:function(e){var t=this;this.$refs[e].validate((function(e){if(!e)return console.log("error submit!!"),!1;Object(o["c"])({svg:t.avatar,name:t.ruleForm.name,password:t.ruleForm.password,email:t.ruleForm.email,code:t.ruleForm.code,sex:t.ruleForm.sex,signature:t.ruleForm.signature?t.ruleForm.signature:"这个人很懒，什么也没有留下~~"}).then((function(e){0!==e.data.code?t.$message({message:e.data.msg,type:"error"}):(t.$message({message:e.data.msg,type:"success"}),t.$router.push("/"))}))}))},sendCode:function(){var e=this,t=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,r=this.ruleForm.email;t.test(r)?(this.buttonTextEnable=!1,Object(o["y"])({email:r}).then((function(t){0==t.data.code?(e.$message({message:"验证码发送成功，有效期5分钟！",type:"success"}),e.timer=setInterval((function(){"发送验证码"==e.buttonText?(e.buttonText="60s",e.buttonTextEnable=!1):(e.buttonText=1*e.buttonText.replace("s","")-1+"s",e.buttonTextEnable=!1,"0s"==e.buttonText&&(e.buttonText="发送验证码",e.buttonTextEnable=!0,clearInterval(e.timer)))}),1e3)):e.buttonTextEnable=!0}))):this.$alert("请输入正确的邮箱地址","提示",{confirmButtonText:"确定"})},resetForm:function(){this.$router.push("/")},signIn:function(){var e=this;Login({username:this.form.username,password:this.form.password}).then((function(t){console.log(t.data),0!==t.data.code?e.$message.error(t.data.msg):(e.$message.success(t.data.msg),e.$router.push("/musicRoom/888"))})).catch((function(e){console.log(e)}))}},mounted:function(){}},u=n,i=(r("859b"),r("2877")),m=Object(i["a"])(u,s,a,!1,null,"6af39f68",null);t["default"]=m.exports},f87c:function(e,t,r){}}]);