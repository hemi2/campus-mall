<template>
  <div class="container">
    <Main-nav />

    <div class="profile">
      <el-card class="profile-card">
        <div slot="header" class="profile-header">
          <el-avatar :src="avatarUrl" size="large"></el-avatar>
          <div class="profile-name">{{ name }}</div>
        </div>
        <div class="profile-body">
          <el-tabs v-model="activeTab">
            <el-tab-pane label="个人资料">
              <el-form :model="formData" :rules="rules" ref="form" label-width="100px" class="centerPane-800">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="name" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="formData.email"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="updataUserEmail('form')">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="收货地址">
              <!-- <el-form :model="addressForm" :rules="rules" ref="form" label-width="100px" class="centerPane-800">
                <el-form-item label="收货地址" prop="address">
                  <el-input v-model="addressForm.address"></el-input>
                </el-form-item>
                <el-form-item label="收货人姓名" prop="name">
                  <el-input v-model="addressForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="addressForm.phone"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="savaAddress('form')">保存</el-button>
                </el-form-item>
              </el-form>

              <el-table :data="addressTableData" style="width: 100%">
                <el-table-column prop="name" label="收货人" width="120">
                </el-table-column>
                <el-table-column prop="address" label="详细地址" width="300">
                </el-table-column>
                <el-table-column prop="phone" label="电话/手机" width="120">
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button @click="editAddress(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteAddress(scope.row.id)" type="text" size="small">删除</el-button>
                  </template>
                </el-table-column>
              </el-table> -->
              <Address> </Address>
            </el-tab-pane>
            <el-tab-pane label="头像照片">
              <div>
                <el-upload class="avatar-uploader" :action="baseUrl + '/files/upload'" :auto-upload="false"
                  :show-file-list="false" :headers="{ token: token }" :on-success="handleAvatarSuccess"
                  :on-change="picturePreview" :before-upload="beforeAvatarUpload" ref="upload">
                  <!-- <img  :src="imageUrl" class="avatar"> -->
                  <el-image v-if="imageUrl" class="avatar" :src="imageUrl">
                  </el-image>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </div>
              <el-button type="primary" @click="uploaderAvatar()">上传</el-button>

            </el-tab-pane>
            <el-tab-pane label="更改密码">
              <el-form :model="passwordForm" :rules="passwordRules" ref="passwordForm" label-width="100px"
                class="centerPane-800">
                <el-form-item label="旧密码" prop="oldPassword">
                  <el-input type="password" v-model="passwordForm.oldPassword"></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="newPassword">
                  <el-input type="password" v-model="passwordForm.newPassword"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input type="password" v-model="passwordForm.confirmPassword"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="changePassword('passwordForm')">保存</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="登录信息">
              <el-row :gutter="20" class="user-info">
                <el-col :span="6">
                  <div class="head">
                    <span class="title">用户浏览器信息</span>
                  </div>
                  <div class="con">
                    <span class="string">{{ getBrowserInfo }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="head">
                    <span class="title">用户登录时间</span>
                  </div>
                  <div class="con">
                    <span class="string">{{ getloginTime }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="head">
                    <span class="title">当前在线数量</span>
                  </div>
                  <div class="con">
                    <span class="string">{{ onlineUsers }}</span>
                  </div>
                </el-col>
                <el-col :span="6">
                  <div class="head">
                    <span class="title">用户注册数量</span>
                  </div>
                  <div class="con">
                    <span class="string">{{ registeredUsers }}</span>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-card>
    </div>
  </div>
</template>
  
<script>
import MainNav from "@/components/MainNav";
import Address from "@/components/Address";
import request from "@/utils/request";
import { getAvatar, updataUser } from '@/api/user'
import axios from 'axios';
export default {

  components: {
    MainNav,
    Address
  },
  data() {
    return {
      activeTab: '0',
      formData: {
        username: "",
        email: "",
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号", trigger: "blur", },
        ],

      },
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      addressForm: {
        id: "",
        address: "",
        name: "",
        phone: ""
      },
      addressTableData: [],
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在6到20个字符之间', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: this.validateConfirmPassword, trigger: 'blur' }
        ],
      },
      file: "",
      imageUrl: "",
      onlineUsers: "",
      registeredUsers: "",
      avatarUrl: "",
      baseUrl: axios.defaults.baseURL
    }
  },

  methods: {
    handleClick(row) {
      console.log(row);
    },
    uploaderAvatar() {
      if (this.beforeAvatarUpload(this.file)) {
        this.$refs.upload.submit();
      }
    },
    changePassword(formName) {
      this.$refs[formName].validate(valid => {
        const pwlist = {
          'oldPassword': this.passwordForm.oldPassword,
          'newPassword': this.passwordForm.confirmPassword,
        }
        if (valid) {
          request.post("user/changePassword", pwlist).then(res => {
            if (res.code === '0') {
              this.$message.success("修改成功,请重新登录");
              localStorage.clear();
              this.$router.push("/login");
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    },
    picturePreview(file, fileList) {
      //预览图片
      if (window.createObjectURL != undefined) {
        this.imageUrl = window.createObjectURL(file.raw);
      } else if (window.URL != undefined) {
        this.imageUrl = window.URL.createObjectURL(file.raw);
      } else if (window.webkitURL != undefined) {
        this.imageUrl = window.webkitURL.createObjectURL(file.raw);
      }
      this.file = file.raw;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 1MB!');
      }
      return isJPG && isLt2M;
    },
    handleAvatarSuccess(res, file) {
      if (res.code === '0') {
        //上传成功后将页面头像进行更新
        this.avatarUrl = URL.createObjectURL(file.raw);
        // 更新数据表用户头像字段
        updataUser({ avatar: res.data })
        this.$message.success('上传成功')
      } else {
        this.$message.error(res.msg)
      }
    },
    updataUserEmail(fromName) {
      this.$refs[fromName].validate(valid => {
        if (valid) {
          updataUser({ "email": this.formData.email }).then(res => {
            if (res.code === '0') {
              this.$message.success(res.data)
            } else {
              this.$message.error(res.msg)
            }
          })
        }
      })
    },
    getUserCount() {
      request.get("user/getUserCount").then(res => {
        if (res.code === '0') {
          this.onlineUsers = res.data.onlineUser
          this.registeredUsers = res.data.registeredUser
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getAddressAll() {
      request.get("address/selectAll").then(res => {
        if (res.code === '0') {
          this.addressTableData = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    savaAddress(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: this.addressForm.id ? '/address/update' : '/address/add',
            method: this.addressForm.id ? 'PUT' : 'POST',
            data: this.addressForm
          }).then(res => {
            if (res.code === '0') {
              this.$message.success('保存成功')
              this.addressForm = {}
              this.getAddressAll()
            } else {
              this.$message.error(res.msg)  // 弹出错误的信息
            }
          })
        }
      })
    },
    editAddress(data) {
      //深拷贝
      this.addressForm = JSON.parse(JSON.stringify(data))
    },
    deleteAddress(id) {
      this.$confirm('您确认删除吗？', '确认删除', { type: "warning" }).then(response => {
        console.log(response);
      }).catch(() => { })
    },
  },
  mounted() {
    this.formData.email = this.email

    this.getUserCount()
    this.getAddressAll()
    if (this.avatar != null && this.avatar.trim()) {
      getAvatar(this.avatar).then(res => {
        this.avatarUrl = URL.createObjectURL(res)
      })
    }


  },
  computed: {
    getloginTime() {
      const loginTime = localStorage.getItem("loginTime");
      if (loginTime) {
        const targetDate = new Date(loginTime);
        // 获取当前时间
        const now = new Date();
        // 计算时间差，单位为毫秒
        const timeDiff = now - targetDate;
        // 计算时间差的天、小时和分钟
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        // 格式化成"00天00小时00分钟"的字符串
        const formattedTimeDiff = `${days.toString().padStart(2, '0')}天${hours.toString().padStart(2, '0')}小时${minutes.toString().padStart(2, '0')}分钟`;
        return formattedTimeDiff
      }
    },
    getBrowserInfo() {
      var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
      if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
      return M.join(' ');
    },
    name() {
      return this.$store.state.user.name
    },
    avatar() {
      return this.$store.state.user.avatar
    },
    email() {
      return this.$store.state.user.email
    },
    loginTime() {
      return this.$store.state.user.loginTime
    },
    token() {
      return this.$store.state.user.token
    }
  },
  watch: {
    avatar(newAvatar) {
    },
    email(newEmail) {
      this.formData.email = this.email
    }
  },
}
</script>

<style>
.profile {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 100px 0 40px 0;
}

.profile-card {
  width: 100%;
}

.profile-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.profile-name {
  font-size: 24px;
  margin-left: 20px;
}

.profile-body {
  padding: 20px;
}

.profile .centerPane-800 {
  margin: 0 auto;
  width: 800px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.user-info .head {
  margin-bottom: 4px;
  color: #606266;
  font-size: 12px;
  text-align: center;
}

.user-info .con {
  font-family: Sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #303133;
}

.user-info .con .string {
  font-size: 18px;
  padding: 0 4px;
}
</style>