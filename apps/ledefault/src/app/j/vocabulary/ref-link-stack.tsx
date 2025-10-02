import type { VocabularyComponentProps } from '../jp-utils'
import RefLink from './ref-link'

/**
 * Renders the stack list of reference links.
 * @param props props
 */
const RefLinkStack = ({ result: { refs } }: VocabularyComponentProps) => (
  <div class="flex flex-row justify-end gap-1 mt-6">
    {/* eslint-disable-next-line react/no-array-index-key */}
    {refs!.map((ref, i) => <RefLink key={`${ref.type}:${i}`} refLink={ref} />)}
  </div>
)

export default RefLinkStack
