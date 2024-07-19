import Vue from 'vue'
import store from '@/store'
import Router from 'vue-router'
import { getToken } from '@/utils/auth' // get token from cookie
import { MessageBox, Message } from 'element-ui'

Vue.use(Router)

//所有权限通用路由表 
//如首页和登录页和一些不用权限的公用页面
export const constantRoutes = [
  { path: '/', redirect: '/home', },
  { path: '/home', name: '首页', component: () => import('@/views/HomeView.vue') },
  { path: '/userInfo', name: '用户信息', component: () => import('@/views/UserInfo.vue') },
  { path: '/login', component: () => import('@/views/Login.vue/') },
  { path: '/detail/:id', name: "detail", component: () => import('@/views/GoodsDetail.vue/') },
  { path: '/typeColumn', name: "typeColumn", component: () => import('@/views/TypeColumn.vue/') },
  { path: '/carts', name: '购物车', component: () => import('@/views/Carts.vue') },
  { path: '/order', name: 'checkout', props: true, component: () => import('@/views/Order.vue') },
  { path: '/orderList', name: '我的订单', component: () => import('@/views/OrderList.vue') },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

]
//异步挂载的路由
//动态需要根据权限加载的路由表 
export const asyncRoutes = [
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/manager',
    name: '后台管理',
    meta: { role: ['admin'] },
    component: () => import('../views/manager/Manager.vue'),
    redirect: '/dashboard',
    children: [
      { path: '/dashboard', name: '仪表盘', meta: { role: ['admin'] }, component: () => import('../views/manager/Dashboard') },
      { path: '/orderList', name: '订单管理', meta: { role: ['admin'] }, component: () => import('../views/manager/Orders') },
      { path: '/type', name: '商品分类', meta: { role: ['admin'] }, component: () => import('../views/manager/Type') },
      { path: '/goods', name: '商品信息', meta: { role: ['admin'] }, component: () => import('../views/manager/Goods') },
      { path: '/user', name: '用户管理', meta: { role: ['admin'] }, component: () => import('../views/manager/User') },
    ]
  }
];


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  // mode: 'hash',
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'active',
})

const router = createRouter()
const whiteListRegex = [
  /^\/login$/,
  /^\/$/,
  /^\/home$/,
  /^\/detail$/, // 保持这条是为了直接匹配 /detail（如果没有动态ID的情况）
  /^\/typeColumn$/,
  /^\/404$/,
  /^\/detail\/.+/ // 新增这条正则表达式来匹配所有以 /detail/ 开头的路径
];
// main.js
router.beforeEach(async (to, from, next) => {
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/home' });
      console.log("get role");
    } else {
      const hasRoles = store.getters.role && store.getters.role.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          const { role } = await store.dispatch('user/getInfo')

          // 根据角色生成可访问路由映射
          const accessRoutes = await store.dispatch('permission/generateRoutes', { roles: [role] })

          // 动态添加可访问路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })

        } catch (err) {
          await store.dispatch('user/resetToken')
          Message.error(err || 'Has Error')
          next(`/login?redirect=${to.path}`)
        }
      }
    }
  } else {
    const isWhiteListed = whiteListRegex.some(regex => regex.test(to.path));

    if (isWhiteListed) { // 在免登录白名单，直接进入
      next();
    } else {
      next(`/login?redirect=${to.path}`)
      Message.error('请先登录')
    }
  }
});

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router