import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/',
    name: 'index',
    component: () => import('../views/Index.vue'),
  },
  {
    path: '/symbols/:symbol',
    name: 'symbols',
    component: () => import('../views/Symbol.vue')
  },
  {
    path: '/symbols/:symbol/comments',
    name: 'CommentHistory',
    component: () => import('../views/CommentHistory.vue'),
  },
  {
    path: '/tos',
    name: 'tos',
    component: () => import('../views/tos.vue'),
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
