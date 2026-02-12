export const ROUTE_NAMES = {
  Dialogs: 'Dialogs',
  DialogsIndex: 'DialogsIndex',
  DialogsChat: 'DialogsChat',
} as const

export const ROUTE_PATHS = {
  [ROUTE_NAMES.Dialogs]: '/dialogs',
  [ROUTE_NAMES.DialogsChat]: '/dialogs/:id',
} as const

export const getDialogsChatPath = (id: number) =>
  `/dialogs/${id}`

export type RouteName = (typeof ROUTE_NAMES)[keyof typeof ROUTE_NAMES]
