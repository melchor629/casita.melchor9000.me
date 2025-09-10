import type { InformalVerbDictionaryEntry, VocabularyComponentProps } from '../jp-utils'
import { NaisTable } from '../shared-components'
import JapaneseWithRomaji from './japanese-with-romaji'

/**
 * Renders the verb conjugation table.
 * @param props props
 */
const InformalVerbTable = ({ result }: VocabularyComponentProps<InformalVerbDictionaryEntry>) => (
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
      <tr>
        <th>te</th>
        <td colspan={2}>
          <JapaneseWithRomaji value={result.forms.te} />
        </td>
      </tr>
      <tr>
        <th>let's do</th>
        <td colspan={2}>
          <JapaneseWithRomaji value={result.forms.letsDo} />
        </td>
      </tr>
      <tr>
        <th class="text-nowrap">
          want to
          <em>(adj)</em>
        </th>
        <td colspan={2}>
          <JapaneseWithRomaji value={result.forms.wantTo} />
        </td>
      </tr>
    </tbody>
    <thead>
      <tr>
        <th><em>(formal)</em></th>
        <th>Positive</th>
        <th>Negative</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Present</th>
        <td>
          <JapaneseWithRomaji value={result.forms.formal.present.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.formal.present.negative} />
        </td>
      </tr>
      <tr>
        <th>Past</th>
        <td>
          <JapaneseWithRomaji value={result.forms.formal.past.positive} />
        </td>
        <td>
          <JapaneseWithRomaji value={result.forms.formal.past.negative} />
        </td>
      </tr>
      <tr>
        <th>let's do</th>
        <td colspan={2}>
          <JapaneseWithRomaji value={result.forms.formal.mashou} />
        </td>
      </tr>
    </tbody>
  </NaisTable>
)

export default InformalVerbTable
