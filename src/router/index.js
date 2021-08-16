import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('views/Login.vue');
const Home = () => import('views/Home.vue');
const Welcome = () => import('views/Welcome.vue');
const Users = () => import('views/user/Users.vue');
const Rights = () => import('views/power/Rights.vue');
const Roles = () => import('views/power/Roles.vue');
const Cate = () => import('views/goods/Cate.vue');

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome
      },
      {
        path: '/users',
        component: Users
      },
      {
        path: '/rights',
        component: Rights
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/categories',
        component: Cate
      }
      
    ]
  }
]

const router = new VueRouter({
  routes
})

/* 导航守卫 */
router.beforeEach((to, from, next) => {
  // 如果是直接访问登录页面，直接放行
  if(to.path == '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  // 不存在token就返回登录界面
  if(!tokenStr) return next('/login');
  next();
})

export default router
