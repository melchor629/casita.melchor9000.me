import type { AdjectiveDictionaryEntry, VocabularyComponentProps } from '../jp-utils'
import { NaisTable } from '../shared-components'
import JapaneseWithRomaji from './japanese-with-romaji'

/**
 * Renders the adjective conjugation table.
 * @param param0 props
 */
const AdjectiveTable = ({ result }: VocabularyComponentProps<AdjectiveDictionaryEntry>) => (
  <NaisTable>
    <thead>
      <tr>
        <th class="w-0" />
        <th>Positive</th>
        <th>Negative</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Present</th>
        <td>
          <JapaneseWithRomaji value={result.forms.present.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.present.negative} />
        </td>
      </tr>
      <tr>
        <th>Past</th>
        <td>
          <JapaneseWithRomaji value={result.forms.past.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.past.negative} />
        </td>
      </tr>
    </tbody>
  </NaisTable>
)

export default AdjectiveTable
