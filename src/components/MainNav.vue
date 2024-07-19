<template>
  <nav class="navbar" role="navigation">
    <ul class="nav navbar-nav">
      <li>
        <router-link active-class="active" to="/home">首页</router-link>
      </li>
      <li>
        <router-link active-class="active" exact to="/typeColumn">分类</router-link>
      </li>
      <li>
        <router-link active-class="active" exact to="/carts">购物车</router-link>
      </li>
      <li>
        <router-link active-class="active" exact to="/orderList">我的订单</router-link>
      </li>
    </ul>
    <ul class="navbar-right" ref="menubtn">
      <template v-if="!isLogin">
        <li><router-link to="/login">登录 / 注册</router-link></li>
      </template>
      <template v-if="isLogin">
        <el-dropdown>
          <span class="el-dropdown-link">
            Hi {{ userName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/carts">
              <el-dropdown-item icon="el-icon-shopping-cart-2">我的购物车</el-dropdown-item>
            </router-link>
            <router-link to="/userInfo">
              <el-dropdown-item icon="el-icon-edit-outline">编辑资料</el-dropdown-item>
            </router-link>
            <router-link to="/manager" v-if="role === 'admin'">
              <el-dropdown-item icon="el-icon-edit-outline">后台管理</el-dropdown-item>
            </router-link>
            <el-dropdown-item icon="el-icon-remove-outline" @click.native="logout()">退出登陆</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </ul>
    <!-- .container-end  -->
  </nav>
  <!-- navbar-end -->
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: "MainNav",
  data() {
    return {
      isLogin: false,
      userName: "",
      role: ''
    };
  },
  computed: {
    ...mapGetters(['token']),
    user: {
      get() {
        try {
          return this.$store.state.user;
        } catch (e) {
          console.error('Error accessing user state:', e);
          return null; // 在异常情况下返回null，避免进一步的运行时错误
        }
      }
    }
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout").then(() => {
        this.$message.success('退出成功')
        this.$router.push("/login");
      }).catch((err) => {
        console.log(err);
      })
    }
  },
  created() {
    // 检查token是否存在
    if (this.token) {
      this.isLogin = true;
      // 添加对user、name、role的存在性检查
      if (this.user && this.user.name && this.user.role) {
        this.userName = this.user.name;
        this.role = this.user.role;
      } else {
        // 如果user、name或role不存在，可以考虑处理这种情况，例如记录日志或显示错误信息
        this.$message.error('User data is incomplete')
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  z-index: 99;
  height: 70px;
  background-color: #ffffffdb;
  backdrop-filter: blur(15px);
  border-radius: 0;
  border: none;
}

.navbar-nav {
  height: 100%;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  top: 0;
  margin: 0;
  padding: 0;
}

.navbar-right {
  align-content: center;
  margin: 0;
  padding: 0 110px;
  list-style: none;
}

.navbar-nav li {
  height: 100%;
  position: relative;
  display: block;
}

.navbar-nav a {
  height: 100%;
  padding: 0 35px;
  display: flex;
  align-items: center;
}

.navbar-nav .active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border: 10px;
  border-style: solid;
  border-color: transparent transparent #00cec9;
  transition: .3s;
}

.nav>li>a:focus,
.nav>li>a:hover {
  text-decoration: none;
  background-color: #eee;
}

.navbar-right a:hover,
.navbar-right>li>a:focus {
  background: #fff;
  color: #00cec9;
}

.el-dropdown-link {
  cursor: pointer;
  color: #00cec9;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.navbar-right>li>a,
.el-dropdown-link {
  color: #00cec9;
  border: 1px solid #76e2e0;
  border-radius: 5px;
  padding: 8px 24px;
  margin: 0 5px;
  transition: 0.3s;
}

.el-icon-arrow-down {
  font-size: 12px;
}

.el-dropdown-link:hover,
.el-dropdown-link:focus {
  background: #fff;
  border: 1px solid #00cec9;
}
</style>