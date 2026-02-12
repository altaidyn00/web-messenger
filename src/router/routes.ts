import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES, ROUTE_PATHS } from '@/enums'

export { ROUTE_NAMES, ROUTE_PATHS } from '@/enums'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dialogs',
  },
  {
    path: ROUTE_PATHS[ROUTE_NAMES.Dialogs],
    component: () => import('@/layouts/DialogsLayout.vue'),
    meta: { layout: 'default' },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.DialogsIndex,
        component: () => import('@/pages/dialogs/index.vue'),
      },
      {
        path: ':id',
        name: ROUTE_NAMES.DialogsChat,
        component: () => import('@/pages/dialogs/[id].vue'),
        props: true,
      },
    ],
  },
]
