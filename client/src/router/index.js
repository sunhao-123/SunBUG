
import { ifLogin } from "../api";

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "Login",
    meta: {
      title: "登录",
      cnName: "登录"
    },
    component: () => import('../views/Login'),
    beforeEnter: (to, from, next) => {
      ifLogin().then(res => {
        if (!res.data.userInfo) {
          next();
        } else {
          next("/musicRoom/888");
        }
      }).catch(() => {
        next();
      })
    },
  },
  {
    path: "/register",
    name: "Register",
    meta: {
      title: "注册",
      cnName: "注册"
    },
    component: () => import('../views/Register'),
    // beforeEnter: (to, from, next) => {
    //   ifLogin().then(res => {
    //     if (!res.data.userInfo) {
    //       next();
    //     } else {
    //       next("/musicRoom/888");
    //     }
    //   }).catch(() => {
    //     next();
    //   })
    // },
  },
  {
    path: "/musicRoom/:id",
    meta: {
      title: "SunBUG 音乐聊天室",
      cnName: "SunBUG 音乐聊天室"
    },
    component: () => import('../views/musicRoom'),
    beforeEnter: (to, from, next) => {
      ifLogin()
        .then(res => {
          if (!res.data.userInfo) {
            next("/");
          } else {
            next();
          }
        })
        .catch((e) => {
          next("/");
        })
    },
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('../views/404/index.vue'),
    meta: {
      title: '404_NotFound',
      cnName: "404_NotFound"
    }
  }
]

const router = new VueRouter({
  routes
})

export default router
