<template>
  <div class="login-bg">
    <div class="container">
      <div :class="{ 'frame': signinActive, 'frame frame-long': !signinActive }">
        <div class="nav">
          <ul>
            <li :class="{ 'signin-active': signinActive, 'signup-inactive': !signinActive }"><a class="btn"
                @click="toggleForm(true)">登录</a></li>
            <li :class="{ 'signup-active': !signinActive, 'signin-inactive': signinActive }"><a class="btn"
                @click="toggleForm(false)">注册</a></li>
          </ul>
        </div>
        <div ng-app ng-init="checked = false">
          <el-form :model="signinRuleForm" status-icon :rules="rules" ref="signinRuleForm" :hide-required-asterisk="true"
            :class="{ 'form-signin': signinActive, 'form-signin form-signin-left': !signinActive }">
            <el-form-item prop="userName" label="用户名" :rules="rules.nameRules">
              <el-input v-model="signinRuleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="signinRuleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <!-- <el-form-item label="登录角色">
              <el-select v-model="signinRuleForm.role" placeholder="请选择角色">
                <el-option label="用户" value="user"></el-option>
                <el-option label="管理员" value="admin"></el-option>
              </el-select>
            </el-form-item> -->
            <input type="checkbox" id="checkbox" v-model="signinRuleForm.keepLogin" />
            <label for="checkbox"><span class="ui"></span>记住密码</label>
            <div class="btn-animate">
              <a class="btn-signin" @click="login('signinRuleForm')">登录</a>
            </div>
          </el-form>

          <el-form :model="signupRuleForm" status-icon :rules="rules" ref="signupRuleForm" :hide-required-asterisk="true"
            :class="{ 'form-signup': signinActive, 'form-signup form-signup-left': !signinActive }">
            <el-form-item prop="userName" label="用户名" :rules="rules.nameRules">
              <el-input v-model="signupRuleForm.userName"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱" :rules="rules.emailRules">
              <el-input v-model="signupRuleForm.email"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pass">
              <el-input type="password" v-model="signupRuleForm.pass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPass">
              <el-input type="password" v-model="signupRuleForm.checkPass" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha" :rules="rules.captchaRules" label-position="top"
              style="display: flex;flex-direction: column;">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-input v-model="signupRuleForm.captcha" autocomplete="off"></el-input>
                </el-col>
                <el-col :span="12">
                  <img :src="captchaImgUrl" alt="" @click="clickImg()" width="100%">
                </el-col>
              </el-row>
            </el-form-item>
            <a class="btn-signup" @click="register('signupRuleForm')">注册</a>
          </el-form>
        </div>
        <div :class="{ 'forgot': signinActive, 'forgot forgot-left': !signinActive }">
          <a href="#">忘记密码？</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";

export default {
  name: 'Login',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.signupRuleForm.checkPass !== '') {
          this.$refs.signupRuleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.signupRuleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      signinActive: true,
      captchaImgUrl: '',
      signinRuleForm: {
        userName: "",
        pass: '',
        role: 'user',
        keepLogin: false
      },
      signupRuleForm: {
        userName: "",
        email: '',
        pass: '',
        checkPass: '',
        captcha: ''
      },
      rules: {
        nameRules: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 4, max: 10, message: '长度在 4 到 10 个字符之间', trigger: 'blur' }
        ],
        emailRules: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        //自定义校验规则
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        captchaRules: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    toggleForm(isToggle) {
      this.signinActive = isToggle;
    },
    register(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const admin = {
            'userName': this.signupRuleForm.userName,
            'password': this.signupRuleForm.checkPass,
            'email': this.signupRuleForm.email,
          }
          request({
            url: "/user/register?verifyCode=" + this.signupRuleForm.captcha,
            method: 'post',
            data: admin,
          }).then(res => {
            if (res.code === '0') {
              this.$message({
                message: '注册成功',
                type: 'success'
              });
              this.signupRuleForm = {}//表单置空
              this.getCodeImg()//重新获取验证码
              this.signinActive = true;// 返回登陆
            } else {
              // this.getCodeImg()
              this.$message({
                message: res.msg,
                type: 'error'
              });
            }
          })
        } else {
          console.log('错误提交!!');
          return false;
        }
      });
    },
    clickImg() {
      this.getCodeImg()
    },
    getCodeImg() {
      request({
        method: 'get',
        url: '/user/getCaptchaCode',
        responseType: 'blob'
      }).then(res => {
        this.captchaImgUrl = URL.createObjectURL(res)
      })
    },
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const admin = {
            'userName': this.signinRuleForm.userName,
            'password': this.signinRuleForm.pass,
            'keepLogin': this.signinRuleForm.keepLogin,
            'loginTime': new Date(new Date(new Date() + 8 * 3600 * 1000)).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
          }
          this.$store.dispatch('user/login', admin).then((res) => {
            // 获取当前路由的查询参数中的redirect值
            const redirectPath = this.$route.query.redirect;
            // 设置目标路径为redirectPath，如果不存在则默认为'/home'
            let targetPath = redirectPath || '/home';
            // 根据目标路径进行路由跳转
            this.$router.push(targetPath);
            localStorage.setItem("loginTime", res.loginTime)
            //是否需要记住密码，将状态保存到localStorage中
            if (this.signinRuleForm.keepLogin) {
              localStorage.setItem("autoFillPassword", 1);
              localStorage.setItem("userName", this.signinRuleForm.userName)
              localStorage.setItem("password", this.signinRuleForm.pass)
            } else {
              localStorage.removeItem("autoFillPassword");
              localStorage.removeItem("userName")
              localStorage.removeItem("password")
            }
          }).catch((err) => {
            console.log(err);
          })
        }
      })
    },
    autoFillPassword() {
      if (localStorage.getItem("autoFillPassword")) {
        this.signinRuleForm.userName = localStorage.getItem("userName");
        this.signinRuleForm.pass = localStorage.getItem("password");
        this.signinRuleForm.keepLogin = localStorage.getItem("autoFillPassword");
      }
    },
  },
  mounted() {
    this.getCodeImg()
    this.autoFillPassword()
  }
}

</script>


<style scoped>
.login-bg {
  background: url("/src/assets/login.jpg") no-repeat center center;
  background-size: cover;
  width: 100%;
  padding: 70px 0 0 0;
  flex: 1;
}

.frame {
  height: 550px;
  width: 430px;
  background: linear-gradient(rgba(35, 43, 85, 0.75), rgba(35, 43, 85, 0.95));
  background-size: cover;
  margin: 0 auto 40px;
  border-top: solid 1px rgba(255, 255, 255, .5);
  border-radius: 5px;
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: all .5s ease;
  overflow: hidden;
}

.nav {
  width: 100%;
  height: 100px;
  padding-top: 40px;
  opacity: 1;
  transition: all 0.5s ease;
}

.nav li {
  padding-left: 10px;
  font-size: 18px;
  display: inline;
  text-align: left;
  text-transform: uppercase;
  padding-right: 10px;
  color: #ffffff;
}

.frame-long {
  height: 750px;
}

.frame-short {
  height: 400px;
  margin-top: 50px;
  box-shadow: 0px 2px 7px rgba(0, 0, 0, 0.1);
}

.nav {
  width: 100%;
  height: 100px;
  padding-top: 40px;
  opacity: 1;
  transition: all .5s ease;
}

.nav-up {
  transform: translateY(-100px);
  opacity: 0;
}

.nav li {
  padding-left: 10px;
  font-size: 18px;
  display: inline;
  text-align: left;
  text-transform: uppercase;
  padding-right: 10px;
  color: #ffffff;
}

.signin-active a,
.signup-active a {
  cursor: pointer;
  color: #ffffff;
  text-decoration: none;
  border-bottom: solid 2px #1059FF;
  transition: all .25s ease;
  padding-bottom: 10px;
}

.err-text {
  color: #ea3e3e;
}


.signup-inactive a,
.signin-inactive a {
  cursor: pointer;
  color: rgba(255, 255, 255, .3);
  text-decoration: none;
  transition: all .25s ease;
}

.form-signin {
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  transition: opacity .5s ease, transform .5s ease;
}

.form-signin-left {
  transform: translateX(-400px);
  opacity: .0;
}

.form-signup {
  height: 375px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  position: relative;
  top: -375px;
  left: 400px;
  opacity: 0;
  transition: all .5s ease;
}

.form-signup-left {
  transform: translateX(-399px);
  opacity: 1;
}

.form-signup-down {
  top: 0px;
  opacity: 0;
}

.success {
  width: 80%;
  height: 150px;
  text-align: center;
  position: relative;
  top: -890px;
  left: 450px;
  opacity: .0;
  transition: all .8s .4s ease;
}

.success-left {
  transform: translateX(-406px);
  opacity: 1;
}

.successtext {
  color: #ffffff;
  font-size: 16px;
  font-weight: 300;
  margin-top: -35px;
  padding-left: 37px;
  padding-right: 37px;
}

#check path {
  stroke: #ffffff;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: .85px;
  stroke-dasharray: 60px 300px;
  stroke-dashoffset: -166px;
  fill: rgba(255, 255, 255, .0);
  transition: stroke-dashoffset 2s ease .5s, fill 1.5s ease 1.0s;
}

#check.checked path {
  stroke-dashoffset: 33px;
  fill: rgba(255, 255, 255, .03);
}

.form-signin input,
.form-signup input {
  color: #ffffff;
  font-size: 13px;
}

.form-styling {
  width: -webkit-fill-available;
  height: 35px;
  padding-left: 15px;
  border: none;
  border-radius: 20px;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, .2);
}

label {
  font-weight: 400;
  text-transform: uppercase;
  font-size: 13px;
  padding-left: 15px;
  padding-bottom: 10px;
  color: rgba(255, 255, 255, .7);
  display: block;
}

:focus {
  outline: none;
}

.form-signin input:focus,
textarea:focus,
.form-signup input:focus,
textarea:focus {
  background: rgba(255, 255, 255, .3);
  border: none;
  padding-right: 40px;
  transition: background .5s ease;
}

[type="checkbox"]:not(:checked),
[type="checkbox"]:checked {
  position: absolute;
  display: none;
}

[type="checkbox"]:not(:checked)+label,
[type="checkbox"]:checked+label {
  position: relative;
  padding-left: 85px;
  padding-top: 2px;
  cursor: pointer;
  margin-top: 8px;
}

[type="checkbox"]:not(:checked)+label:before,
[type="checkbox"]:checked+label:before,
[type="checkbox"]:not(:checked)+label:after,
[type="checkbox"]:checked+label:after {
  content: '';
  position: absolute;
}

[type="checkbox"]:not(:checked)+label:before,
[type="checkbox"]:checked+label:before {
  width: 65px;
  height: 30px;
  background: rgba(255, 255, 255, .2);
  border-radius: 15px;
  left: 0;
  top: -3px;
  transition: all .2s ease;
}

[type="checkbox"]:not(:checked)+label:after,
[type="checkbox"]:checked+label:after {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, .7);
  border-radius: 50%;
  top: 7px;
  left: 10px;
  transition: all .2s ease;
}

/* on checked */
[type="checkbox"]:checked+label:before {
  background: #0F4FE6;
}

[type="checkbox"]:checked+label:after {
  background: #ffffff;
  top: 7px;
  left: 45px;
}

[type="checkbox"]:checked+label .ui,
[type="checkbox"]:not(:checked)+label .ui:before,
[type="checkbox"]:checked+label .ui:after {
  position: absolute;
  left: 6px;
  width: 65px;
  border-radius: 15px;
  font-size: 14px;
  font-weight: bold;
  line-height: 22px;
  transition: all .2s ease;
}

[type="checkbox"]:not(:checked)+label .ui:before {
  content: "no";
  left: 32px;
  color: rgba(255, 255, 255, .7);
}

[type="checkbox"]:checked+label .ui:after {
  content: "yes";
  color: #ffffff;
}

[type="checkbox"]:focus+label:before {
  box-sizing: border-box;
  margin-top: -1px;
}

.btn-signup {
  float: left;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: #ffffff;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 20px;
  margin-top: 10px;
  background-color: #1059FF;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-signin {
  float: left;
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-animate {
  float: left;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 20px;
  margin-top: 23px;
  background-color: rgba(16, 89, 255, 1);
  left: 0px;
  top: 0px;
  transition: all .5s ease, top .5s ease .5s, height .5s ease .5s, background-color .5s ease .75s;
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-animate-grow {
  width: 130%;
  height: 625px;
  position: relative;
  left: -55px;
  top: -420px;
  color: rgba(255, 255, 255, 0);
  background-color: rgba(255, 255, 255, 1);
}

a.btn-signup:hover,
a.btn-signin:hover {
  cursor: pointer;
  background-color: #0F4FE6;
  transition: background-color .5s;
}

.forgot {
  display: flex;
  justify-content: center;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  padding-top: 24px;
  margin-top: -425px;
  border-top: solid 1px rgba(255, 255, 255, .3);
  transition: all 0.5s ease;
}

.forgot-left {
  transform: translateX(-400px);
  opacity: 0;
}

.forgot-fade {
  opacity: 0;
}

.forgot a {
  color: rgba(255, 255, 255, .3);
  font-weight: 400;
  font-size: 13px;
  text-decoration: none;
}
</style>
<style>
.frame .el-form-item__label {
  font-weight: 400;
  text-transform: uppercase;
  font-size: 13px;
  line-height: normal;
  padding: 0 0 10px 15px;
  color: rgba(255, 255, 255, .7);
  display: block;
  text-align: left;
}

.frame .el-input__inner {
  width: -webkit-fill-available;
  height: 35px;
  padding-left: 15px;
  border: none;
  border-radius: 20px;
  background: rgba(255, 255, 255, .2);
}

.frame .el-form input {
  color: #ffffff;
  font-size: 13px;
}

.frame .el-form-item__error {
  position: absolute;
  right: 0;
  text-align: center;
}

.frame .el-form-item__content {
  margin-bottom: 10px;
}

.frame .el-select {
  width: 100%;
}
</style>