import { makeStyles } from '@melchor629/ui/utils'

const headerElementClasses = makeStyles({
  base: 'inline-flex flex-col text-body text-text-main',
  slots: {
    label: 'text-text-secondary text-body-small font-light select-none text-center',
  },
})

type HeaderElementProps = Readonly<{
  label: string
  children: React.ReactNode
}>

export default function HeaderElement({ children, label }: HeaderElementProps) {
  const styles = headerElementClasses()
  return (
    <div className={styles.base()}>
      <span className={styles.label()}>{label}</span>
      <span>{children}</span>
    </div>
  )
}
