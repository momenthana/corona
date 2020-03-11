import Vue from 'vue'
import VueRouter from 'vue-router'
import Mask from '../views/Mask.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Mask',
    component: Mask
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
