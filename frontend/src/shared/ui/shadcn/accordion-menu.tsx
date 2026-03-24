import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { cva, type VariantProps } from 'class-variance-authority'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/shared/utils/cn'

// ─── Context ──────────────────────────────────────────────────────────────────

export interface AccordionMenuClassNames {
  root?: string
  group?: string
  label?: string
  separator?: string
  item?: string
  sub?: string
  subTrigger?: string
  subContent?: string
  subWrapper?: string
  indicator?: string
}

interface AccordionMenuContextValue {
  matchPath: (href: string) => boolean
  selectedValue: string | undefined
  setSelectedValue: React.Dispatch<React.SetStateAction<string | undefined>>
  classNames?: AccordionMenuClassNames
  nestedStates: Record<string, string | string[]>
  setNestedStates: React.Dispatch<React.SetStateAction<Record<string, string | string[]>>>
  onItemClick?: (value: string, event: React.MouseEvent) => void
}

const AccordionMenuContext = React.createContext<AccordionMenuContextValue>({
  matchPath: () => false,
  selectedValue: '',
  setSelectedValue: () => {},
  nestedStates: {},
  setNestedStates: () => {},
})

// ─── Root ─────────────────────────────────────────────────────────────────────

interface AccordionMenuProps {
  selectedValue?: string
  matchPath?: (href: string) => boolean
  classNames?: AccordionMenuClassNames
  onItemClick?: (value: string, event: React.MouseEvent) => void
}

function AccordionMenu({
  className,
  matchPath = () => false,
  classNames,
  children,
  selectedValue,
  onItemClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & AccordionMenuProps) {
  const [internalSelectedValue, setInternalSelectedValue] = React.useState<string | undefined>(selectedValue)
  React.useEffect(() => {
    setInternalSelectedValue(selectedValue)
  }, [selectedValue])

  const initialNestedStates = React.useMemo(() => {
    const getActiveChain = (nodes: React.ReactNode, chain: string[] = []): string[] => {
      let result: string[] = []
      React.Children.forEach(nodes, (node) => {
        if (React.isValidElement(node)) {
          const { value, children: nodeChildren } = node.props as { value?: string; children?: React.ReactNode }
          const newChain = value ? [...chain, value] : chain
          if (value && (value === selectedValue || matchPath(value))) {
            result = newChain
          } else if (nodeChildren) {
            const childChain = getActiveChain(nodeChildren, newChain)
            if (childChain.length > 0) result = childChain
          }
        }
      })
      return result
    }

    const chain = getActiveChain(children)
    const trimmedChain = chain.length > 1 ? chain.slice(0, chain.length - 1) : chain
    const mapping: Record<string, string | string[]> = {}
    if (trimmedChain.length > 0) {
      if (props.type === 'multiple') {
        mapping['root'] = trimmedChain
      } else {
        mapping['root'] = trimmedChain[0]
        for (let i = 0; i < trimmedChain.length - 1; i++) {
          mapping[trimmedChain[i]] = trimmedChain[i + 1]
        }
      }
    }
    return mapping
  }, [children, matchPath, selectedValue, props.type])

  const [nestedStates, setNestedStates] = React.useState<Record<string, string | string[]>>(initialNestedStates)

  const multipleValue = (
    Array.isArray(nestedStates['root'])
      ? nestedStates['root']
      : typeof nestedStates['root'] === 'string'
        ? [nestedStates['root']]
        : []
  ) as string[]
  const singleValue = (nestedStates['root'] ?? '') as string

  const ctxValue = React.useMemo(
    () => ({ matchPath, selectedValue: internalSelectedValue, setSelectedValue: setInternalSelectedValue, classNames, onItemClick, nestedStates, setNestedStates }),
    [matchPath, internalSelectedValue, classNames, onItemClick, nestedStates],
  )

  return (
    <AccordionMenuContext.Provider value={ctxValue}>
      {props.type === 'single' ? (
        <AccordionPrimitive.Root
          data-slot="accordion-menu"
          value={singleValue}
          className={cn('w-full', classNames?.root, className)}
          onValueChange={(v: string) => setNestedStates((prev) => ({ ...prev, root: v }))}
          {...(props as React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & { type: 'single' })}
          role="menu"
        >
          {children}
        </AccordionPrimitive.Root>
      ) : (
        <AccordionPrimitive.Root
          data-slot="accordion-menu"
          value={multipleValue}
          className={cn('w-full', classNames?.root, className)}
          onValueChange={(v: string[]) => setNestedStates((prev) => ({ ...prev, root: v }))}
          {...(props as React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root> & { type: 'multiple' })}
          role="menu"
        >
          {children}
        </AccordionPrimitive.Root>
      )}
    </AccordionMenuContext.Provider>
  )
}

// ─── Group ────────────────────────────────────────────────────────────────────

function AccordionMenuGroup({ children, className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { classNames } = React.useContext(AccordionMenuContext)
  return (
    <div data-slot="accordion-menu-group" role="group" className={cn('space-y-0.5', classNames?.group, className)} {...props}>
      {children}
    </div>
  )
}

// ─── Label ────────────────────────────────────────────────────────────────────

function AccordionMenuLabel({ children, className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { classNames } = React.useContext(AccordionMenuContext)
  return (
    <div
      data-slot="accordion-menu-label"
      role="presentation"
      className={cn('px-2 py-1.5 text-xs font-medium text-muted-foreground', classNames?.label, className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Separator ────────────────────────────────────────────────────────────────

function AccordionMenuSeparator({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const { classNames } = React.useContext(AccordionMenuContext)
  return (
    <div
      data-slot="accordion-menu-separator"
      role="separator"
      className={cn('my-1 h-px bg-border', classNames?.separator, className)}
      {...props}
    />
  )
}

// ─── Item ─────────────────────────────────────────────────────────────────────

const itemVariants = cva(
  'relative cursor-pointer select-none flex w-full text-start items-center text-foreground rounded-lg gap-2 px-2 py-1.5 text-sm outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground disabled:opacity-50 disabled:bg-transparent [&_svg]:pointer-events-none [&_svg]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0 [&>a]:flex [&>a]:w-full [&>a]:items-center [&>a]:gap-2',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'text-destructive hover:text-destructive focus:text-destructive hover:bg-destructive/5',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

function AccordionMenuItem({
  className,
  children,
  variant,
  onClick,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> &
  VariantProps<typeof itemVariants> & {
    onClick?: React.MouseEventHandler<HTMLElement>
  }) {
  const { classNames, selectedValue, matchPath, onItemClick } = React.useContext(AccordionMenuContext)
  return (
    <AccordionPrimitive.Item className="flex" {...props}>
      <AccordionPrimitive.Header className="flex w-full">
        <AccordionPrimitive.Trigger
          data-slot="accordion-menu-item"
          className={cn(itemVariants({ variant }), classNames?.item, className)}
          onClick={(e) => {
            if (onItemClick) onItemClick(props.value, e)
            if (onClick) onClick(e)
            e.preventDefault()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              const firstChild = (e.currentTarget as HTMLElement).firstElementChild as HTMLElement | null
              firstChild?.click()
            }
          }}
          data-selected={matchPath(props.value as string) || selectedValue === props.value ? 'true' : undefined}
        >
          {children}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </AccordionPrimitive.Item>
  )
}

// ─── Sub ──────────────────────────────────────────────────────────────────────

function AccordionMenuSub({ className, children, ...props }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  const { classNames } = React.useContext(AccordionMenuContext)
  return (
    <AccordionPrimitive.Item data-slot="accordion-menu-sub" className={cn(classNames?.sub, className)} {...props}>
      {children}
    </AccordionPrimitive.Item>
  )
}

// ─── SubTrigger ───────────────────────────────────────────────────────────────

function AccordionMenuSubTrigger({ className, children }: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  const { classNames } = React.useContext(AccordionMenuContext)
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-menu-sub-trigger"
        className={cn(
          'w-full relative flex items-center cursor-pointer select-none text-start rounded-lg gap-2 px-2 py-1.5 text-sm outline-hidden text-foreground transition-colors hover:bg-accent hover:text-accent-foreground [&_svg]:pointer-events-none [&_svg:not([role=img]):not([class*=text-])]:opacity-60 [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
          classNames?.subTrigger,
          className,
        )}
      >
        {children}
        <ChevronDown
          data-slot="accordion-menu-sub-indicator"
          className="ms-auto size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:-rotate-180"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

// ─── SubContent ───────────────────────────────────────────────────────────────

type AccordionMenuSubContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> & {
  type: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string | string[]
  parentValue: string
}

function AccordionMenuSubContent({ className, children, type, collapsible, defaultValue, parentValue, ...props }: AccordionMenuSubContentProps) {
  const { nestedStates, setNestedStates, classNames } = React.useContext(AccordionMenuContext)

  let currentValue: string | string[]
  if (type === 'multiple') {
    const sv = nestedStates[parentValue]
    currentValue = Array.isArray(sv) ? sv : typeof sv === 'string' ? [sv] : defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  } else {
    currentValue = (nestedStates[parentValue] ?? defaultValue ?? '') as string
  }

  return (
    <AccordionPrimitive.Content
      data-slot="accordion-menu-sub-content"
      className={cn('ps-5 overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down', classNames?.subContent, className)}
      {...props}
    >
      {type === 'multiple' ? (
        <AccordionPrimitive.Root
          className={cn('w-full py-0.5', classNames?.subWrapper)}
          type="multiple"
          value={currentValue as string[]}
          role="menu"
          data-slot="accordion-menu-sub-wrapper"
          onValueChange={(v) => setNestedStates((prev) => ({ ...prev, [parentValue]: Array.isArray(v) ? v : [v] }))}
        >
          {children}
        </AccordionPrimitive.Root>
      ) : (
        <AccordionPrimitive.Root
          className={cn('w-full py-0.5', classNames?.subWrapper)}
          type="single"
          collapsible={collapsible ?? true}
          value={currentValue as string}
          role="menu"
          data-slot="accordion-menu-sub-wrapper"
          onValueChange={(v) => setNestedStates((prev) => ({ ...prev, [parentValue]: v }))}
        >
          {children}
        </AccordionPrimitive.Root>
      )}
    </AccordionPrimitive.Content>
  )
}

export {
  AccordionMenu,
  AccordionMenuGroup,
  AccordionMenuItem,
  AccordionMenuLabel,
  AccordionMenuSeparator,
  AccordionMenuSub,
  AccordionMenuSubContent,
  AccordionMenuSubTrigger,
}
