import type { DemonstrativeDictionaryEntry, VocabularyComponentProps } from '../jp-utils'
import { NaisTable } from '../shared-components'
import JapaneseWithRomaji from './japanese-with-romaji'

/**
 * Renders the demostratives table.
 * @param param0 props
 */
const DemonstrativeTable = ({ result }: VocabularyComponentProps<DemonstrativeDictionaryEntry>) => (
  <>
    <NaisTable>
      <thead>
        <tr>
          <th class="w-0">Tipo</th>
          <th>Japonés</th>
          <th>Significado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>cerca locutor</th>
          <td>
            <JapaneseWithRomaji value={result.forms.k[0]} />
          </td>
          <td>{result.forms.k[1]}</td>
        </tr>
        <tr>
          <th>cerca oyente</th>
          <td>
            <JapaneseWithRomaji value={result.forms.s[0]} />
          </td>
          <td>{result.forms.s[1]}</td>
        </tr>
        <tr>
          <th>lejos</th>
          <td>
            <JapaneseWithRomaji value={result.forms.a[0]} />
          </td>
          <td>{result.forms.a[1]}</td>
        </tr>
        <tr>
          <th>interrogativo</th>
          <td>
            <JapaneseWithRomaji value={result.forms.d[0]} />
          </td>
          <td>{result.forms.d[1]}</td>
        </tr>
      </tbody>
    </NaisTable>

    <p class={result.details ? 'pb-2' : ''}>
      Este demostrativo actúa como un
      {' '}
      {result.actsAs === 'adjective' ? 'adjetivo' : 'sustantivo'}
      .
    </p>
  </>
)

export default DemonstrativeTable
