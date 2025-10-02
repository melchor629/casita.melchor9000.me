import type { BasicVerbDictionaryEntry, VocabularyComponentProps } from '../jp-utils'
import { NaisTable } from '../shared-components'
import JapaneseWithRomaji from './japanese-with-romaji'

/**
 * Renders the verb conjugation table.
 * @param props props
 */
const BasicVerbTable = ({ result }: VocabularyComponentProps<BasicVerbDictionaryEntry>) => (
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
      {result.forms.te && (
        <tr>
          <th>te</th>
          <td colspan={2}>
            <JapaneseWithRomaji value={result.forms.te} />
          </td>
        </tr>
      )}
      {result.forms.mashou && (
        <tr>
          <th>mashou</th>
          <td colspan={2}>
            <JapaneseWithRomaji value={result.forms.mashou} />
          </td>
        </tr>
      )}
      {result.forms.tai && (
        <tr>
          <th>
            tai
            <em>(adj)</em>
          </th>
          <td colspan={2}>
            <JapaneseWithRomaji value={result.forms.tai} />
          </td>
        </tr>
      )}
    </tbody>
  </NaisTable>
)

export default BasicVerbTable
