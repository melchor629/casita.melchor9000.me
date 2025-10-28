import { useMemo } from 'preact/hooks'
import type { KanjiEntry, VocabularyComponentProps } from '../jp-utils'
import { NaisTable } from '../shared-components'
import JapaneseWithRomaji from './japanese-with-romaji'

/**
 * Renders the readings of the kanji
 * @param props props
 * @returns rendered html
 */
const KanjiReadings = ({ result: { kunyomi, onyomi } }: VocabularyComponentProps<KanjiEntry>) => (
  <NaisTable>
    <tbody>
      <tr>
        <th className="w-20">on-yomi</th>
        <td>{useMemo(() => <JapaneseWithRomaji value={onyomi} />, [onyomi])}</td>
      </tr>
      <tr>
        <th className="w-20">kun-yomi</th>
        <td>{useMemo(() => <JapaneseWithRomaji value={kunyomi} />, [kunyomi])}</td>
      </tr>
    </tbody>
  </NaisTable>
)

export default KanjiReadings
