import type { ElementType, Ref } from 'react'
import { makeStyles, type MakeStylesProps, type OverridableComponent, type OverridableComponentProps } from '../utils'

const textStyles = makeStyles({
  base: '',
  variants: {
    size: {
      bodySmall: 'text-body-small',
      body: 'text-body',
      bodyLarge: 'text-body-large',
      h4: 'text-h4',
      h3: 'text-h3',
      h2: 'text-h2',
      h1: 'text-h1',
    },
    weight: {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      bold: 'font-bold',
    },
    color: {
      textMain: 'text-text-main',
      textSecondary: 'text-text-secondary',
      contrasted: 'text-text-contrasted',
      primary: 'text-primary-main',
      secondary: 'text-secondary-main',
      warning: 'text-warning-main',
      error: 'text-error-main',
      inherit: 'text-inherit',
    },
    underline: {
      true: 'underline',
    },
    italic: {
      true: 'italic',
    },
    ellipsize: {
      true: 'text-ellipsis text-nowrap overflow-hidden max-w-full',
    },
    align: {
      start: 'text-start',
      end: 'text-end',
      center: 'text-center',
      justify: 'text-justify',
    },
  },
  defaultVariants: {
    color: 'textMain',
    weight: 'normal',
    size: 'body',
  },
})

const sizeMappings = Object.freeze({
  body: 'p',
  bodySmall: 'p',
  bodyLarge: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
} as Record<NonNullable<MakeStylesProps<typeof textStyles>['size']>, ElementType>)

type TextTypeMap = {
  props: MakeStylesProps<typeof textStyles> & {
    ref?: Ref<HTMLElement>
  }
  defaultComponent: 'p'
}

export type TextProps<C extends ElementType = TextTypeMap['defaultComponent']> = OverridableComponentProps<TextTypeMap, C>

const Text: OverridableComponent<TextTypeMap> = ({
  align,
  className,
  color,
  ellipsize,
  italic,
  size,
  underline,
  weight,
  ...props
}: TextProps) => {
  const Component = props.component ?? sizeMappings[size ?? 'body']
  return <Component {...props} className={textStyles({ align, className, color, ellipsize, italic, size, underline, weight })} />
}

export default Text
