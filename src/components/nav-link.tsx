import { ComponentProps } from "react"

interface NavLinkProps extends ComponentProps<'a'> {
  children: string
}

export function NavLink({ children, ...props }: NavLinkProps){
  return (
    <a className="font-medium text-sm text-zinc-300" {...props}>
      {children}
    </a>
  )
}
