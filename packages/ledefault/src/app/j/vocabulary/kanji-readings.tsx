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
        <th>on-yomi</th>
        <td>{useMemo(() => [onyomi].flat().map((value) => <JapaneseWithRomaji key={value} value={value} />), [onyomi])}</td>
      </tr>
      <tr>
        <th>kun-yomi</th>
        <td>{useMemo(() => [kunyomi].flat().map((value) => <JapaneseWithRomaji key={value} value={value} />), [kunyomi])}</td>
      </tr>
    </tbody>
  </NaisTable>
)

export default KanjiReadings
