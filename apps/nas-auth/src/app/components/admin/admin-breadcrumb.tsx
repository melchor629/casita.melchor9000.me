import { Link } from '@melchor629/nice-ssr'
import { useMemo } from 'preact/hooks'
import { Fragment } from 'preact/jsx-runtime'

type AdminBreadcrumbProps = Readonly<{
  sections?: ReadonlyArray<{ part: string, name: string }>
}>

const LinkContent = ({ children }: { readonly children: string }) => (
  <span className="text-slate-900 dark:text-slate-100 bg-slate-400 dark:bg-slate-600 hover:bg-slate-200 dark:hover:bg-slate-800 px-1 py-0.5 rounded-sm transition">{children}</span>
)

export default function AdminBreadcrumb({ sections = [] }: AdminBreadcrumbProps) {
  const links = useMemo(() => (
    sections
      .map(({ name, part }, i) => ({
        name,
        path: (i ? '/admin/' : '/admin') + sections.slice(0, i).map((part) => part.part).join('/') + `/${part}`,
      }))
  ), [sections])

  return (
    <div className="mt-2 text-xs text-slate-900 dark:text-slate-100 select-none">
      <Link to="/"><LinkContent>Home</LinkContent></Link>
      &nbsp;&gt;&nbsp;
      <Link to="/admin"><LinkContent>Admin</LinkContent></Link>
      {links.map(({ name, path }) => (
        <Fragment key={path}>
          &nbsp;&gt;&nbsp;
          <Link to={path}><LinkContent>{name}</LinkContent></Link>
        </Fragment>
      ))}
    </div>
  )
}
