import { Link } from '@melchor629/nice-ssr'
import { Fragment, useMemo } from 'react'

type AdminBreadcrumbProps = Readonly<{
  sections?: ReadonlyArray<{ part: string; name: string }>
}>

const LinkContent = ({ children }: { readonly children: string }) => (
  <span className="text-text-main bg-elevated-border hover:bg-elevated-1 rounded-sm px-1 py-0.5 transition">
    {children}
  </span>
)

export default function AdminBreadcrumb({ sections = [] }: AdminBreadcrumbProps) {
  const links = useMemo(
    () =>
      sections.map(({ name, part }, i) => ({
        name,
        path:
          (i ? '/admin/' : '/admin')
          + sections
            .slice(0, i)
            .map((part) => part.part)
            .join('/')
          + `/${part}`,
      })),
    [sections],
  )

  return (
    <div className="text-text-main mt-2 text-xs select-none">
      <Link to="/">
        <LinkContent>Home</LinkContent>
      </Link>
      &nbsp;&gt;&nbsp;
      <Link to="/admin">
        <LinkContent>Admin</LinkContent>
      </Link>
      {links.map(({ name, path }) => (
        <Fragment key={path}>
          &nbsp;&gt;&nbsp;
          <Link to={path}>
            <LinkContent>{name}</LinkContent>
          </Link>
        </Fragment>
      ))}
    </div>
  )
}
