import type { VocabularyComponentProps } from '../jp-utils'
import RefLink from './ref-link'

/**
 * Renders the stack list of reference links.
 *
 * @param props Props
 */
const RefLinkStack = ({ result: { refs } }: VocabularyComponentProps) => (
  <div className="mt-6 flex flex-row flex-wrap justify-end gap-1">
    {refs!.map((ref, i) => (
      <RefLink
        /* oxlint-disable-next-line react/no-array-index-key */
        key={`${ref.type}:${i}`}
        refLink={ref}
      />
    ))}
  </div>
)

export default RefLinkStack
