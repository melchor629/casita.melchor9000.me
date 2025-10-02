import { newQueue } from '@henrygd/queue'
import { toHiragana, toKatakana } from 'wanakana'
import type { DictionaryEntry, MutDictionaryEntry } from './jp-utils'

const queue = newQueue(1)
const dictionaryPromise = loadDictionary()

self.addEventListener('message', (e) => {
  handleMessage(e.data).catch(() => {})
})

async function handleMessage(filter: unknown) {
  try {
    if (filter == null) {
      return
    }

    if (typeof filter === 'string') {
      self.postMessage(await queue.add(async () => {
        if (filter) {
          return filterResults(await dictionaryPromise, filter)
        }

        return []
      }))
    } else if (typeof filter === 'object' && 'type' in filter) {
      //
    }
  } catch (e) {
    console.error(e)
  }
}

async function loadDictionary() {
  const [basic, intermediate] = await Promise.all([loadBasicDictionary(), loadIntermediateDictionary()])
  return Object.freeze([...basic, ...intermediate])
}

async function loadBasicDictionary() {
  const path = '/j/dict.basic.json'
  const res = await fetch(path, { cache: 'no-cache' })
  const yml = await res.json() as MutDictionaryEntry[][]
  return Object.freeze(yml.flat().map((entry) => processVocabEntry(entry, 'basic')))
}

async function loadIntermediateDictionary() {
  const path = '/j/dict.intermediate.json'
  const res = await fetch(path, { cache: 'no-cache' })
  const yml = await res.json() as Record<string, MutDictionaryEntry[]>
  return Object.freeze(
    Object.entries(yml)
      .flatMap(([chapter, entries]) => entries.map((entry) => processVocabEntry(entry, 'intermediate', chapter))),
  )
}

const godanTransformations = (() => {
  const fn = (masu: string, mashou: string, negative: string, past: string, te: string) =>
    Object.freeze({ masu, mashou, negative, past, te })
  return Object.freeze({
    う: fn('い', 'お', 'わ', 'った', 'って'),
    く: fn('き', 'こ', 'か', 'いた', 'いて'),
    ぐ: fn('ぎ', 'ご', 'が', 'いだ', 'いで'),
    す: fn('し', 'そ', 'さ', 'した', 'して'),
    つ: fn('ち', 'と', 'た', 'った', 'って'),
    ぬ: fn('に', 'の', 'な', 'んだ', 'んで'),
    ぶ: fn('び', 'ぼ', 'ば', 'んだ', 'んで'),
    む: fn('み', 'も', 'ま', 'んだ', 'んで'),
    る: fn('り', 'ろ', 'ら', 'った', 'って'),
  } satisfies Record<string, ReturnType<typeof fn>>)
})()

/**
 * @param entry One entry of the vocabulary dictionary.
 * @param level The level in which this entry belongs to.
 * @param chapter Optional chapter to fill in the entry.
 * @returns Altered vocabulary.
 */
function processVocabEntry(entry: MutDictionaryEntry, level: 'basic' | 'intermediate', chapter?: number | string) {
  if (entry.type === 'verb') {
    const root = entry.value.slice(0, -2)
    entry.forms ??= {} as never
    entry.forms.present ??= {} as never
    entry.forms.past ??= {} as never
    entry.forms.present.positive ??= entry.value
    entry.forms.present.negative ??= `${root}ません`
    entry.forms.past.positive ??= `${root}ました`
    entry.forms.past.negative ??= `${root}ません でした`
    entry.forms.mashou ??= `${root}ましょう`
    entry.forms.tai ??= `${root}たい`
  }

  if (entry.type === 'ichidan-verb') {
    const root = entry.value.slice(0, -1)
    entry.forms ??= {} as never
    entry.forms.present ??= {} as never
    entry.forms.past ??= {} as never
    entry.forms.present.positive ??= `${root}る`
    entry.forms.present.negative ??= `${root}ない`
    entry.forms.past.positive ??= `${root}た`
    entry.forms.past.negative ??= `${root}なかった`
    entry.forms.letsDo ??= `${root}よう`
    entry.forms.te ??= `${root}て`
    entry.forms.wantTo ??= `${root}たい`
    entry.forms.formal = {
      present: {
        positive: `${root}ます`,
        negative: `${root}ません`,
      },
      past: {
        positive: `${root}ました`,
        negative: `${root}ません でした`,
      },
      mashou: `${root}ましょう`,
    }
  }

  if (entry.type === 'godan-verb') {
    const root = entry.value.slice(0, -1)
    const changer = entry.value.slice(-1) as keyof typeof godanTransformations
    const { mashou, masu, negative, past, te } = godanTransformations[changer]
    entry.forms ??= {} as never
    entry.forms.present ??= {} as never
    entry.forms.past ??= {} as never
    entry.forms.present.positive ??= entry.value
    entry.forms.present.negative ??= `${root}${negative}ない`
    entry.forms.past.positive ??= `${root}${past}`
    entry.forms.past.negative ??= `${root}${negative}なかった`
    entry.forms.letsDo ??= `${root}${mashou}う`
    entry.forms.te ??= `${root}${te}`
    entry.forms.wantTo ??= `${root}${masu}たい`
    entry.forms.formal = {
      present: {
        positive: `${root}${masu}ます`,
        negative: `${root}${masu}ません`,
      },
      past: {
        positive: `${root}${masu}ました`,
        negative: `${root}${masu}ません でした`,
      },
      mashou: `${root}${masu}ましょう`,
    }
  }

  if (entry.type === 'irregular-verb' && typeof entry.forms.formal === 'string') {
    const root = (entry.forms.formal as unknown as string).slice(0, -2)
    entry.forms.formal = {
      present: {
        positive: `${root}ます`,
        negative: `${root}ません`,
      },
      past: {
        positive: `${root}ました`,
        negative: `${root}ません でした`,
      },
      mashou: `${root}ましょう`,
    }
  }

  if (entry.type === 'adjective') {
    const root = entry.value.slice(0, -1)
    entry.forms ??= {} as never
    entry.forms.present ??= {} as never
    entry.forms.past ??= {} as never
    entry.forms.present.positive ??= entry.value
    entry.forms.present.negative ??= `${root}くない`
    entry.forms.past.positive ??= `${root}かった`
    entry.forms.past.negative ??= `${root}くなかった`
  }

  entry.chapter ??= Number(chapter)
  entry.level = level

  return Object.freeze(entry) as DictionaryEntry
}

/**
 * @param dictionary The dictionary list.
 * @param filter String filter to apply to the vocabulary dictionary.
 * @returns Filtered vocabulary.
 */
function filterResults(dictionary: readonly DictionaryEntry[], filter: string) {
  let results = Iterator.from(dictionary)
  for (const p of filter.split(' ')) {
    if (p.includes(':')) {
      const [tag, value] = p.toLowerCase().split(':')
      if (!value) {
        results = Iterator.from([])
      }
      if (tag === 't') {
        results = results.filter((result) => result.type.startsWith(value))
      } else if (tag === 'c') {
        const chapter = parseInt(value, 10)
        results = results.filter((result) => result.chapter === chapter)
      } else if (tag === 'l') {
        const level = value.startsWith('b') ? 'basic' : (value.startsWith('i') ? 'intermediate' : '')
        results = results.filter((result) => result.level === level)
      }
    } else {
      const exact = p.startsWith('=')
      const latValue = (exact ? p.slice(1) : p).toLowerCase()
      const hiraValue = toHiragana(latValue)
      const kataValue = toKatakana(latValue)
      if (exact) {
        results = results.filter((result) => (
          result.meaning === latValue
          || result.value === hiraValue
          || result.value === kataValue
        ))
      } else {
        results = results.filter((result) => (
          result.meaning.includes(latValue)
          || result.value.includes(hiraValue)
          || result.value.includes(kataValue)
        ))
      }
    }
  }

  return results.toArray()
}
