import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
export { ROUTE_NAMES, ROUTE_PATHS } from './routes'
