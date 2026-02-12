export const BUTTON_VARIANT = {
  Ghost: 'ghost',
  Primary: 'primary',
  Secondary: 'secondary',
} as const

export const BUTTON_SIZE = {
  Sm: 'sm',
  Md: 'md',
  Lg: 'lg',
  Icon: 'icon',
} as const

export const BUTTON_TYPE = {
  Button: 'button',
  Submit: 'submit',
} as const

export const LOADER_SIZE = {
  Large: 'large',
  Medium: 'medium',
  Small: 'small',
} as const

export const LOADER_COLOR = {
  Primary: 'primary',
  Secondary: 'secondary',
  White: 'white',
} as const

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT]
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE]
export type ButtonType = (typeof BUTTON_TYPE)[keyof typeof BUTTON_TYPE]
export type LoaderSize = (typeof LOADER_SIZE)[keyof typeof LOADER_SIZE]
export type LoaderColor = (typeof LOADER_COLOR)[keyof typeof LOADER_COLOR]
