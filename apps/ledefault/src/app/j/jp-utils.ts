import * as wanakana from 'wanakana'

const kana: [hiragana: string, latin: string, katakana: string][][] = [
  [
    ['あ', 'a', 'ア'],
    ['い', 'i', 'イ'],
    ['う', 'u', 'ウ'],
    ['え', 'e', 'エ'],
    ['お', 'o', 'オ'],
  ],
  [],
  [
    ['か', 'ka', 'カ'],
    ['き', 'ki', 'キ'],
    ['く', 'ku', 'ク'],
    ['け', 'ke', 'ケ'],
    ['こ', 'ko', 'コ'],
  ],
  [
    ['が', 'ga', 'ガ'],
    ['ぎ', 'gi', 'ギ'],
    ['ぐ', 'gu', 'グ'],
    ['げ', 'ge', 'ゲ'],
    ['ご', 'go', 'ゴ'],
  ],
  [],
  [
    ['さ', 'sa', 'サ'],
    ['し', 'shi', 'シ'],
    ['す', 'su', 'ス'],
    ['せ', 'se', 'セ'],
    ['そ', 'so', 'ソ'],
  ],
  [
    ['ざ', 'za', 'ザ'],
    ['じ', 'ji', 'ジ'],
    ['ず', 'zu', 'ズ'],
    ['ぜ', 'ze', 'ゼ'],
    ['ぞ', 'zo', 'ゾ'],
  ],
  [],
  [
    ['た', 'ta', 'タ'],
    ['ち', 'chi', 'チ'],
    ['つ', 'tsu', 'ツ'],
    ['て', 'te', 'テ'],
    ['と', 'to', 'ト'],
  ],
  [
    ['だ', 'da', 'ダ'],
    ['ぢ', 'ji', 'ヂ'],
    ['づ', 'zu', 'ヅ'],
    ['で', 'de', 'デ'],
    ['ど', 'do', 'ド'],
  ],
  [],
  [
    ['な', 'na', 'ナ'],
    ['に', 'ni', 'ニ'],
    ['ぬ', 'nu', 'ヌ'],
    ['ね', 'ne', 'ネ'],
    ['の', 'no', 'ノ'],
  ],
  [],
  [
    ['は', 'ha', 'ハ'],
    ['ひ', 'hi', 'ヒ'],
    ['ふ', 'fu', 'フ'],
    ['へ', 'he', 'ヘ'],
    ['ほ', 'ho', 'ホ'],
  ],
  [
    ['ば', 'ba', 'バ'],
    ['び', 'bi', 'ビ'],
    ['ぶ', 'bu', 'ブ'],
    ['べ', 'be', 'ベ'],
    ['ぼ', 'bo', 'ボ'],
  ],
  [
    ['ぱ', 'pa', 'パ'],
    ['ぴ', 'pi', 'ピ'],
    ['ぷ', 'pu', 'プ'],
    ['ぺ', 'pe', 'ペ'],
    ['ぽ', 'po', 'ポ'],
  ],
  [],
  [
    ['ま', 'ma', 'マ'],
    ['み', 'mi', 'ミ'],
    ['む', 'mu', 'ム'],
    ['め', 'me', 'メ'],
    ['も', 'mo', 'モ'],
  ],
  [],
  [
    ['や', 'ya', 'ヤ'],
    ['ゆ', 'yu', 'ユ'],
    ['よ', 'yo', 'ヨ'],
  ],
  [],
  [
    ['ら', 'ra', 'ラ'],
    ['り', 'ri', 'リ'],
    ['る', 'ru', 'ル'],
    ['れ', 're', 'レ'],
    ['ろ', 'ro', 'ロ'],
  ],
  [],
  [
    ['わ', 'wa', 'ワ'],
    ['を', '(w)o', 'ヲ'],
    ['ん', 'n', 'ン'],
    ['ゔ', 'vu', 'ヴ'],
  ],
]

const kanaSpecials = {
  ySeriesSpecialKanas: {
    ji: ['じ', 'ジ'],
    fu: ['ふ', 'フ'],
    shi: ['し', 'シ'],
    chi: ['ち', 'チ'],
    tsu: ['つ', 'ツ'],
    vu: ['ゔ', 'ヴ'],
  },
  ySeries: {
    ya: ['ゃ', 'ャ'],
    yu: ['ゅ', 'ュ'],
    yo: ['ょ', 'ョ'],
  },
  tsu: ['っ', 'ッ'],
  vocals: {
    a: ['ぁ', 'ァ'],
    i: ['ぃ', 'ィ'],
    e: ['ぇ', 'ェ'],
    o: ['ぉ', 'ォ'],
  },
}

const hiraganaCharRows = [
  ...kana.map((serie) => serie.map(([h, l]) => [h, l] as const)),
  [],
  [
    ...Object.entries(kanaSpecials.ySeries)
      .map(([lat, [h]]) => [h, lat] as const),
    [kanaSpecials.tsu[0], 'x2'] as const,
  ],
]
const katakanaCharRows = [
  ...kana.map((serie) => serie.filter((r) => r.length === 3).map(([, l, k]) => [k, l] as const)),
  [],
  [
    ...Object.entries(kanaSpecials.ySeries)
      .map(([lat, [, k]]) => [k, lat] as const),
    [kanaSpecials.tsu[1], 'x2'] as const,
  ],
]

/**
 * Converts kana to romaji
 **/
function toRomaji(value: string): string {
  return wanakana.toRomaji(value)
}

export { toRomaji, hiraganaCharRows, katakanaCharRows }

type Mutable<T> = (
  T extends object
    ? { -readonly [K in keyof T]: Mutable<T[K]> }
    : T extends ReadonlyArray<infer TT>
      ? Array<Mutable<TT>>
      : T
)

export type EntryRef = Readonly<
  | { type: 'basic' | 'intermediate', chapter: number, word?: string }
  | { type: 'url', url: string | URL, name: string }
>

export type BaseDictionaryEntry<TType extends string = string> = Readonly<{
  type: TType
  chapter: number
  level: 'basic' | 'intermediate'
  value: string
  meaning: string
  details?: string
  refs?: ReadonlyArray<EntryRef>
}>

export type NounDictionaryEntry = BaseDictionaryEntry<'noun'> & Readonly<{
  pronuntiation?: string
}>

export type MarkerDictionaryEntry = BaseDictionaryEntry<'marker'>
export type PhraseDictionaryEntry = BaseDictionaryEntry<'phrase'>
export type InterrogativeDictionaryEntry = BaseDictionaryEntry<'interrogative'>
export type NaAdjectiveDictionaryEntry = BaseDictionaryEntry<'na-adj'>
export type NoAdjectiveDictionaryEntry = BaseDictionaryEntry<'no-adj'>

export type BasicVerbDictionaryEntry = BaseDictionaryEntry<'verb'> & Readonly<{
  forms: Readonly<{
    present: {
      readonly positive: string
      readonly negative: string
    }
    past: {
      readonly positive: string
      readonly negative: string
    }
    te?: string
    mashou: string
    tai: string
  }>
}>

export type AdjectiveDictionaryEntry = BaseDictionaryEntry<'adjective'> & Readonly<{
  forms: Readonly<{
    present: {
      readonly positive: string
      readonly negative: string
    }
    past: {
      readonly positive: string
      readonly negative: string
    }
  }>
}>

export type DemonstrativeDictionaryEntry = BaseDictionaryEntry<'demonstrative'> & Readonly<{
  actsAs: 'noun' | 'adjective'
  forms: Readonly<{
    k: readonly [jp: string, sp: string]
    s: readonly [jp: string, sp: string]
    a: readonly [jp: string, sp: string]
    d: readonly [jp: string, sp: string]
  }>
}>

export type InformalVerbDictionaryEntry = BaseDictionaryEntry<'ichidan-verb' | 'godan-verb' | 'irregular-verb'> & Readonly<{
  forms: Readonly<{
    present: {
      readonly positive: string
      readonly negative: string
    }
    past: {
      readonly positive: string
      readonly negative: string
    }
    te: string
    letsDo: string
    wantTo: string
    formal: Omit<BasicVerbDictionaryEntry['forms'], 'te' | 'tai'>
  }>
}>

export type KanjiEntry = BaseDictionaryEntry<'kanji'> & Readonly<{
  onyomi: string
  kunyomi: string
}>

export type DictionaryEntry =
  | NounDictionaryEntry
  | MarkerDictionaryEntry
  | PhraseDictionaryEntry
  | InterrogativeDictionaryEntry
  | NaAdjectiveDictionaryEntry
  | NoAdjectiveDictionaryEntry
  | BasicVerbDictionaryEntry
  | AdjectiveDictionaryEntry
  | DemonstrativeDictionaryEntry
  | InformalVerbDictionaryEntry
  | KanjiEntry

export type MutDictionaryEntry = Mutable<DictionaryEntry>

export type VocabularyComponentProps<T extends DictionaryEntry = DictionaryEntry> = { readonly result: T }
