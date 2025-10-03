/* eslint-disable @typescript-eslint/no-redeclare */
import type { IPicture } from 'music-metadata'
import { Type, type Static } from './type-helpers.ts'

// generated with the below and huge link:
// https://sinclairzx81.github.io/typebox-workbench/?share=ZXhwb3J0IGludGVyZmFjZSBJUmF0aW8gewogICAgLyoqCiAgICAgKiBbMC4uMV0KICAgICAqLwogICAgcmF0aW86IG51bWJlcjsKICAgIC8qKgogICAgICogRGVjaWJlbAogICAgICovCiAgICBkQjogbnVtYmVyOwp9CgpleHBvcnQgaW50ZXJmYWNlIElDb21tZW50IHsKICAgIGRlc2NyaXB0b3I%2FOiBzdHJpbmc7CiAgICBsYW5ndWFnZT86IHN0cmluZzsKICAgIHRleHQ%2FOiBzdHJpbmc7Cn0KCmV4cG9ydCBpbnRlcmZhY2UgSUx5cmljc1RleHQgewogICAgdGV4dDogc3RyaW5nOwogICAgdGltZXN0YW1wPzogbnVtYmVyOwp9CgpleHBvcnQgaW50ZXJmYWNlIElMeXJpY3NUYWcgZXh0ZW5kcyBJQ29tbWVudCB7CiAgICBjb250ZW50VHlwZTogbnVtYmVyOwogICAgdGltZVN0YW1wRm9ybWF0OiBudW1iZXI7CiAgICAvKioKICAgICAqIFVuLXN5bmNocm9uaXplZCBseXJpY3MKICAgICAqLwogICAgdGV4dD86IHN0cmluZzsKICAgIC8qKgogICAgICogU3luY2hyb25pemVkIGx5cmljcwogICAgICovCiAgICBzeW5jVGV4dDogSUx5cmljc1RleHRbXTsKfQoKZXhwb3J0IGludGVyZmFjZSBJUmF0aW5nIHsKICAgIC8qKgogICAgICogUmF0aW5nIHNvdXJjZSwgY291bGQgYmUgYW4gZS1tYWlsIGFkZHJlc3MKICAgICAqLwogICAgc291cmNlPzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBSYXRpbmcgWzAuLjFdCiAgICAgKi8KICAgIHJhdGluZz86IG51bWJlcjsKfQoKZXhwb3J0IGludGVyZmFjZSBJQ29tbW9uVGFnc1Jlc3VsdCB7CiAgICB0cmFjazogewogICAgICAgIG5vOiBudW1iZXIgfCBudWxsOwogICAgICAgIG9mOiBudW1iZXIgfCBudWxsOwogICAgfTsKICAgIGRpc2s6IHsKICAgICAgICBubzogbnVtYmVyIHwgbnVsbDsKICAgICAgICBvZjogbnVtYmVyIHwgbnVsbDsKICAgIH07CiAgICAvKioKICAgICAqIFJlbGVhc2UgeWVhcgogICAgICovCiAgICB5ZWFyPzogbnVtYmVyOwogICAgLyoqCiAgICAgKiBUcmFjayB0aXRsZQogICAgICovCiAgICB0aXRsZT86IHN0cmluZzsKICAgIC8qKgogICAgICogVHJhY2ssIG1heWJlIHNldmVyYWwgYXJ0aXN0cyB3cml0dGVuIGluIGEgc2luZ2xlIHN0cmluZy4KICAgICAqLwogICAgYXJ0aXN0Pzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBUcmFjayBhcnRpc3RzLCBhaW1zIHRvIGNhcHR1cmUgZXZlcnkgYXJ0aXN0IGluIGEgZGlmZmVyZW50IHN0cmluZy4KICAgICAqLwogICAgYXJ0aXN0cz86IHN0cmluZ1tdOwogICAgLyoqCiAgICAgKiBUcmFjayBhbGJ1bSBhcnRpc3RzCiAgICAgKi8KICAgIGFsYnVtYXJ0aXN0Pzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBBbGJ1bSB0aXRsZQogICAgICovCiAgICBhbGJ1bT86IHN0cmluZzsKICAgIC8qKgogICAgICogRGF0ZQogICAgICovCiAgICBkYXRlPzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBPcmlnaW5hbCByZWxlYXNlIGRhdGUKICAgICAqLwogICAgb3JpZ2luYWxkYXRlPzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBPcmlnaW5hbCByZWxlYXNlIHllYXIKICAgICAqLwogICAgb3JpZ2luYWx5ZWFyPzogbnVtYmVyOwogICAgLyoqCiAgICAgKiBSZWxlYXNlIGRhdGUKICAgICAqLwogICAgcmVsZWFzZWRhdGU%2FOiBzdHJpbmc7CiAgICAvKioKICAgICAqIExpc3Qgb2YgY29tbWVudHMKICAgICAqLwogICAgY29tbWVudD86IElDb21tZW50W107CiAgICAvKioKICAgICAqIEdlbnJlCiAgICAgKi8KICAgIGdlbnJlPzogc3RyaW5nW107CiAgICAvKioKICAgICAqIEVtYmVkZGVkIGFsYnVtIGFydAogICAgICovCiAgICAvLyBwaWN0dXJlPzogSVBpY3R1cmVbXTsKICAgIC8qKgogICAgICogVHJhY2sgY29tcG9zZXIKICAgICAqLwogICAgY29tcG9zZXI%2FOiBzdHJpbmdbXTsKICAgIC8qKgogICAgICogU3luY2hyb25pemVkIGx5cmljcwogICAgICovCiAgICBseXJpY3M%2FOiBJTHlyaWNzVGFnW107CiAgICAvKioKICAgICAqIEFsYnVtIHRpdGxlLCBmb3JtYXR0ZWQgZm9yIGFscGhhYmV0aWMgb3JkZXJpbmcKICAgICAqLwogICAgYWxidW1zb3J0Pzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBUcmFjayB0aXRsZSwgZm9ybWF0dGVkIGZvciBhbHBoYWJldGljIG9yZGVyaW5nCiAgICAgKi8KICAgIHRpdGxlc29ydD86IHN0cmluZzsKICAgIC8qKgogICAgICogVGhlIGNhbm9uaWNhbCB0aXRsZSBvZiB0aGUgd29yawogICAgICovCiAgICB3b3JrPzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBUcmFjayBhcnRpc3QsIGZvcm1hdHRlZCBmb3IgYWxwaGFiZXRpYyBvcmRlcmluZwogICAgICovCiAgICBhcnRpc3Rzb3J0Pzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBBbGJ1bSBhcnRpc3QsIGZvcm1hdHRlZCBmb3IgYWxwaGFiZXRpYyBvcmRlcmluZwogICAgICovCiAgICBhbGJ1bWFydGlzdHNvcnQ%2FOiBzdHJpbmc7CiAgICAvKioKICAgICAqIENvbXBvc2VyLCBmb3JtYXR0ZWQgZm9yIGFscGhhYmV0aWMgb3JkZXJpbmcKICAgICAqLwogICAgY29tcG9zZXJzb3J0Pzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBMeXJpY2lzdChzKQogICAgICovCiAgICBseXJpY2lzdD86IHN0cmluZ1tdOwogICAgLyoqCiAgICAgKiBXcml0ZXIocykKICAgICAqLwogICAgd3JpdGVyPzogc3RyaW5nW107CiAgICAvKioKICAgICAqIENvbmR1Y3RvcihzKQogICAgICovCiAgICBjb25kdWN0b3I%2FOiBzdHJpbmdbXTsKICAgIC8qKgogICAgICogUmVtaXhlcihzKQogICAgICovCiAgICByZW1peGVyPzogc3RyaW5nW107CiAgICAvKioKICAgICAqIEFycmFuZ2VyKHMpCiAgICAgKi8KICAgIGFycmFuZ2VyPzogc3RyaW5nW107CiAgICAvKioKICAgICAqIEVuZ2luZWVyKHMpCiAgICAgKi8KICAgIGVuZ2luZWVyPzogc3RyaW5nW107CiAgICAvKioKICAgICAqIFB1Ymxpc2hlcihzKQogICAgICovCiAgICBwdWJsaXNoZXI%2FOiBzdHJpbmdbXTsKICAgIC8qKgogICAgICogUHJvZHVjZXIocykKICAgICAqLwogICAgcHJvZHVjZXI%2FOiBzdHJpbmdbXTsKICAgIC8qKgogICAgICogTWl4LURKKHMpCiAgICAgKi8KICAgIGRqbWl4ZXI%2FOiBzdHJpbmdbXTsKICAgIC8qKgogICAgICogTWl4ZWQgYnkKICAgICAqLwogICAgbWl4ZXI%2FOiBzdHJpbmdbXTsKICAgIHRlY2huaWNpYW4%2FOiBzdHJpbmdbXTsKICAgIGxhYmVsPzogc3RyaW5nW107CiAgICBncm91cGluZz86IHN0cmluZzsKICAgIHN1YnRpdGxlPzogc3RyaW5nW107CiAgICBkZXNjcmlwdGlvbj86IHN0cmluZ1tdOwogICAgbG9uZ0Rlc2NyaXB0aW9uPzogc3RyaW5nOwogICAgZGlzY3N1YnRpdGxlPzogc3RyaW5nW107CiAgICB0b3RhbHRyYWNrcz86IHN0cmluZzsKICAgIHRvdGFsZGlzY3M%2FOiBzdHJpbmc7CiAgICBtb3ZlbWVudFRvdGFsPzogbnVtYmVyOwogICAgY29tcGlsYXRpb24%2FOiBib29sZWFuOwogICAgcmF0aW5nPzogSVJhdGluZ1tdOwogICAgYnBtPzogbnVtYmVyOwogICAgLyoqCiAgICAgKiBLZXl3b3JkcyB0byByZWZsZWN0IHRoZSBtb29kIG9mIHRoZSBhdWRpbywgZS5nLiAnUm9tYW50aWMnIG9yICdTYWQnCiAgICAgKi8KICAgIG1vb2Q%2FOiBzdHJpbmc7CiAgICAvKioKICAgICAqIFJlbGVhc2UgZm9ybWF0LCBlLmcuICdDRCcKICAgICAqLwogICAgbWVkaWE%2FOiBzdHJpbmc7CiAgICAvKioKICAgICAqIFJlbGVhc2UgY2F0YWxvZyBudW1iZXIocykKICAgICAqLwogICAgY2F0YWxvZ251bWJlcj86IHN0cmluZ1tdOwogICAgLyoqCiAgICAgKiBUViBzaG93IHRpdGxlCiAgICAgKi8KICAgIHR2U2hvdz86IHN0cmluZzsKICAgIC8qKgogICAgICogVFYgc2hvdyB0aXRsZSwgZm9ybWF0dGVkIGZvciBhbHBoYWJldGljIG9yZGVyaW5nCiAgICAgKi8KICAgIHR2U2hvd1NvcnQ%2FOiBzdHJpbmc7CiAgICAvKioKICAgICAqIFRWIHNlYXNvbiB0aXRsZSBzZXF1ZW5jZSBudW1iZXIKICAgICAqLwogICAgdHZTZWFzb24%2FOiBudW1iZXI7CiAgICAvKioKICAgICAqIFRWIEVwaXNvZGUgc2VxdWVuY2UgbnVtYmVyCiAgICAgKi8KICAgIHR2RXBpc29kZT86IG51bWJlcjsKICAgIC8qKgogICAgICogVFYgZXBpc29kZSBJRAogICAgICovCiAgICB0dkVwaXNvZGVJZD86IHN0cmluZzsKICAgIC8qKgogICAgICogVFYgbmV0d29yawogICAgICovCiAgICB0dk5ldHdvcms%2FOiBzdHJpbmc7CiAgICBwb2RjYXN0PzogYm9vbGVhbjsKICAgIHBvZGNhc3R1cmw%2FOiBzdHJpbmc7CiAgICByZWxlYXNlc3RhdHVzPzogc3RyaW5nOwogICAgcmVsZWFzZXR5cGU%2FOiBzdHJpbmdbXTsKICAgIHJlbGVhc2Vjb3VudHJ5Pzogc3RyaW5nOwogICAgc2NyaXB0Pzogc3RyaW5nOwogICAgbGFuZ3VhZ2U%2FOiBzdHJpbmc7CiAgICBjb3B5cmlnaHQ%2FOiBzdHJpbmc7CiAgICBsaWNlbnNlPzogc3RyaW5nOwogICAgZW5jb2RlZGJ5Pzogc3RyaW5nOwogICAgZW5jb2RlcnNldHRpbmdzPzogc3RyaW5nOwogICAgZ2FwbGVzcz86IGJvb2xlYW47CiAgICBiYXJjb2RlPzogc3RyaW5nOwogICAgaXNyYz86IHN0cmluZ1tdOwogICAgYXNpbj86IHN0cmluZzsKICAgIG11c2ljYnJhaW56X3JlY29yZGluZ2lkPzogc3RyaW5nOwogICAgbXVzaWNicmFpbnpfdHJhY2tpZD86IHN0cmluZzsKICAgIG11c2ljYnJhaW56X2FsYnVtaWQ%2FOiBzdHJpbmc7CiAgICBtdXNpY2JyYWluel9hcnRpc3RpZD86IHN0cmluZ1tdOwogICAgbXVzaWNicmFpbnpfYWxidW1hcnRpc3RpZD86IHN0cmluZ1tdOwogICAgbXVzaWNicmFpbnpfcmVsZWFzZWdyb3VwaWQ%2FOiBzdHJpbmc7CiAgICBtdXNpY2JyYWluel93b3JraWQ%2FOiBzdHJpbmc7CiAgICBtdXNpY2JyYWluel90cm1pZD86IHN0cmluZzsKICAgIG11c2ljYnJhaW56X2Rpc2NpZD86IHN0cmluZzsKICAgIGFjb3VzdGlkX2lkPzogc3RyaW5nOwogICAgYWNvdXN0aWRfZmluZ2VycHJpbnQ%2FOiBzdHJpbmc7CiAgICBtdXNpY2lwX3B1aWQ%2FOiBzdHJpbmc7CiAgICBtdXNpY2lwX2ZpbmdlcnByaW50Pzogc3RyaW5nOwogICAgd2Vic2l0ZT86IHN0cmluZzsKICAgICdwZXJmb3JtZXI6aW5zdHJ1bWVudCc%2FOiBzdHJpbmdbXTsKICAgIGF2ZXJhZ2VMZXZlbD86IG51bWJlcjsKICAgIHBlYWtMZXZlbD86IG51bWJlcjsKICAgIG5vdGVzPzogc3RyaW5nW107CiAgICBvcmlnaW5hbGFsYnVtPzogc3RyaW5nOwogICAgb3JpZ2luYWxhcnRpc3Q%2FOiBzdHJpbmc7CiAgICBkaXNjb2dzX2FydGlzdF9pZD86IG51bWJlcltdOwogICAgZGlzY29nc19yZWxlYXNlX2lkPzogbnVtYmVyOwogICAgZGlzY29nc19sYWJlbF9pZD86IG51bWJlcjsKICAgIGRpc2NvZ3NfbWFzdGVyX3JlbGVhc2VfaWQ%2FOiBudW1iZXI7CiAgICBkaXNjb2dzX3ZvdGVzPzogbnVtYmVyOwogICAgZGlzY29nc19yYXRpbmc%2FOiBudW1iZXI7CiAgICAvKioKICAgICAqIFRyYWNrIGdhaW4gcmF0aW8gWzAuLjFdCiAgICAgKi8KICAgIHJlcGxheWdhaW5fdHJhY2tfZ2Fpbl9yYXRpbz86IG51bWJlcjsKICAgIC8qKgogICAgICogVHJhY2sgcGVhayByYXRpbyBbMC4uMV0KICAgICAqLwogICAgcmVwbGF5Z2Fpbl90cmFja19wZWFrX3JhdGlvPzogbnVtYmVyOwogICAgLyoqCiAgICAgKiBUcmFjayBnYWluIHJhdGlvCiAgICAgKi8KICAgIHJlcGxheWdhaW5fdHJhY2tfZ2Fpbj86IElSYXRpbzsKICAgIC8qKgogICAgICogVHJhY2sgcGVhayByYXRpbwogICAgICovCiAgICByZXBsYXlnYWluX3RyYWNrX3BlYWs%2FOiBJUmF0aW87CiAgICAvKioKICAgICAqIEFsYnVtIGdhaW4gcmF0aW8KICAgICAqLwogICAgcmVwbGF5Z2Fpbl9hbGJ1bV9nYWluPzogSVJhdGlvOwogICAgLyoqCiAgICAgKiBBbGJ1bSBwZWFrIHJhdGlvCiAgICAgKi8KICAgIHJlcGxheWdhaW5fYWxidW1fcGVhaz86IElSYXRpbzsKICAgIC8qKgogICAgICogbWluaW11bSAmIG1heGltdW0gZ2xvYmFsIGdhaW4gdmFsdWVzIGFjcm9zcyBhIHNldCBvZiBmaWxlcyBzY2FubmVkIGFzIGFuIGFsYnVtCiAgICAgKi8KICAgIHJlcGxheWdhaW5fdW5kbz86IHsKICAgICAgICBsZWZ0Q2hhbm5lbDogbnVtYmVyOwogICAgICAgIHJpZ2h0Q2hhbm5lbDogbnVtYmVyOwogICAgfTsKICAgIC8qKgogICAgICogbWluaW11bSAmIG1heGltdW0gZ2xvYmFsIGdhaW4gdmFsdWVzIGFjcm9zcyBhIHNldCBvZiBmaWxlCiAgICAgKi8KICAgIHJlcGxheWdhaW5fdHJhY2tfbWlubWF4PzogbnVtYmVyW107CiAgICAvKioKICAgICAqIG1pbmltdW0gJiBtYXhpbXVtIGdsb2JhbCBnYWluIHZhbHVlcyBhY3Jvc3MgYSBzZXQgb2YgZmlsZXMgc2Nhbm5lZCBhcyBhbiBhbGJ1bQogICAgICovCiAgICByZXBsYXlnYWluX2FsYnVtX21pbm1heD86IG51bWJlcltdOwogICAgLyoqCiAgICAgKiBUaGUgaW5pdGlhbCBrZXkgb2YgdGhlIG11c2ljIGluIHRoZSBmaWxlLCBlLmcuICJBIE1pbm9yIi4KICAgICAqIFJlZjogaHR0cHM6Ly9kb2NzLm1pY3Jvc29mdC5jb20vZW4tdXMvd2luZG93cy93aW4zMi93bWZvcm1hdC93bS1pbml0aWFsa2V5CiAgICAgKi8KICAgIGtleT86IHN0cmluZzsKICAgIC8qKgogICAgICogUG9kY2FzdCBDYXRlZ29yeQogICAgICovCiAgICBjYXRlZ29yeT86IHN0cmluZ1tdOwogICAgLyoqCiAgICAgKiBpVHVuZXMgVmlkZW8gUXVhbGl0eQogICAgICoKICAgICAqIDI6IEZ1bGwgSEQKICAgICAqIDE6IEhECiAgICAgKiAwOiBTRAogICAgICovCiAgICBoZFZpZGVvPzogbnVtYmVyOwogICAgLyoqCiAgICAgKiBQb2RjYXN0IEtleXdvcmRzCiAgICAgKi8KICAgIGtleXdvcmRzPzogc3RyaW5nW107CiAgICAvKioKICAgICAqIE1vdmVtZW50CiAgICAgKi8KICAgIG1vdmVtZW50Pzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBNb3ZlbWVudCBJbmRleC9Ub3RhbAogICAgICovCiAgICBtb3ZlbWVudEluZGV4OiB7CiAgICAgICAgbm86IG51bWJlciB8IG51bGw7CiAgICAgICAgb2Y6IG51bWJlciB8IG51bGw7CiAgICB9OwogICAgLyoqCiAgICAgKiBQb2RjYXN0IElkZW50aWZpZXIKICAgICAqLwogICAgcG9kY2FzdElkPzogc3RyaW5nOwogICAgLyoqCiAgICAgKiBTaG93IE1vdmVtZW50CiAgICAgKi8KICAgIHNob3dNb3ZlbWVudD86IGJvb2xlYW47CiAgICAvKioKICAgICAqIGlUdW5lcyBNZWRpYSBUeXBlCiAgICAgKgogICAgICogMTogTm9ybWFsCiAgICAgKiAyOiBBdWRpb2Jvb2sKICAgICAqIDY6IE11c2ljIFZpZGVvCiAgICAgKiA5OiBNb3ZpZQogICAgICogMTA6IFRWIFNob3cKICAgICAqIDExOiBCb29rbGV0CiAgICAgKiAxNDogUmluZ3RvbmUKICAgICAqCiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20vc2VyZ2lvbWIyL2xpYm1wNHYyL3dpa2kvaVR1bmVzTWV0YWRhdGEjdXNlci1jb250ZW50LW1lZGlhLXR5cGUtc3RpawogICAgICovCiAgICBzdGlrPzogbnVtYmVyOwp9

export type IRatio = Static<typeof IRatio>
export const IRatio = Type.Object({
  ratio: Type.Number(),
  dB: Type.Number(),
})

export type IComment = Static<typeof IComment>
export const IComment = Type.Object({
  descriptor: Type.Optional(Type.String()),
  language: Type.Optional(Type.String()),
  text: Type.Optional(Type.String()),
})

export type ILyricsText = Static<typeof ILyricsText>
export const ILyricsText = Type.Object({
  text: Type.String(),
  timestamp: Type.Optional(Type.Number()),
})

export type ILyricsTag = Static<typeof ILyricsTag>
export const ILyricsTag = Type.Interface([IComment], {
  contentType: Type.Number(),
  timeStampFormat: Type.Number(),
  text: Type.Optional(Type.String()),
  syncText: Type.Array(ILyricsText),
})

export type IRating = Static<typeof IRating>
export const IRating = Type.Object({
  source: Type.Optional(Type.String()),
  rating: Type.Optional(Type.Number()),
})

export type ICommonTagsResult = Static<typeof ICommonTagsResult>
export const ICommonTagsResult = Type.Object({
  track: Type.Object({
    no: Type.Union([Type.Number(), Type.Null()]),
    of: Type.Union([Type.Number(), Type.Null()]),
  }),
  disk: Type.Object({
    no: Type.Union([Type.Number(), Type.Null()]),
    of: Type.Union([Type.Number(), Type.Null()]),
  }),
  year: Type.Optional(Type.Number()),
  title: Type.Optional(Type.String()),
  artist: Type.Optional(Type.String()),
  artists: Type.Optional(Type.Array(Type.String())),
  albumartist: Type.Optional(Type.String()),
  album: Type.Optional(Type.String()),
  date: Type.Optional(Type.String()),
  originaldate: Type.Optional(Type.String()),
  originalyear: Type.Optional(Type.Number()),
  releasedate: Type.Optional(Type.String()),
  comment: Type.Optional(Type.Array(IComment)),
  genre: Type.Optional(Type.Array(Type.String())),
  composer: Type.Optional(Type.Array(Type.String())),
  lyrics: Type.Optional(Type.Array(ILyricsTag)),
  albumsort: Type.Optional(Type.String()),
  titlesort: Type.Optional(Type.String()),
  work: Type.Optional(Type.String()),
  artistsort: Type.Optional(Type.String()),
  albumartistsort: Type.Optional(Type.String()),
  composersort: Type.Optional(Type.String()),
  lyricist: Type.Optional(Type.Array(Type.String())),
  writer: Type.Optional(Type.Array(Type.String())),
  conductor: Type.Optional(Type.Array(Type.String())),
  remixer: Type.Optional(Type.Array(Type.String())),
  arranger: Type.Optional(Type.Array(Type.String())),
  engineer: Type.Optional(Type.Array(Type.String())),
  publisher: Type.Optional(Type.Array(Type.String())),
  producer: Type.Optional(Type.Array(Type.String())),
  djmixer: Type.Optional(Type.Array(Type.String())),
  mixer: Type.Optional(Type.Array(Type.String())),
  technician: Type.Optional(Type.Array(Type.String())),
  label: Type.Optional(Type.Array(Type.String())),
  grouping: Type.Optional(Type.String()),
  subtitle: Type.Optional(Type.Array(Type.String())),
  description: Type.Optional(Type.Array(Type.String())),
  longDescription: Type.Optional(Type.String()),
  discsubtitle: Type.Optional(Type.Array(Type.String())),
  totaltracks: Type.Optional(Type.String()),
  totaldiscs: Type.Optional(Type.String()),
  movementTotal: Type.Optional(Type.Number()),
  compilation: Type.Optional(Type.Boolean()),
  rating: Type.Optional(Type.Array(IRating)),
  bpm: Type.Optional(Type.Number()),
  mood: Type.Optional(Type.String()),
  media: Type.Optional(Type.String()),
  catalognumber: Type.Optional(Type.Array(Type.String())),
  tvShow: Type.Optional(Type.String()),
  tvShowSort: Type.Optional(Type.String()),
  tvSeason: Type.Optional(Type.Number()),
  tvEpisode: Type.Optional(Type.Number()),
  tvEpisodeId: Type.Optional(Type.String()),
  tvNetwork: Type.Optional(Type.String()),
  podcast: Type.Optional(Type.Boolean()),
  podcasturl: Type.Optional(Type.String()),
  releasestatus: Type.Optional(Type.String()),
  releasetype: Type.Optional(Type.Array(Type.String())),
  releasecountry: Type.Optional(Type.String()),
  script: Type.Optional(Type.String()),
  language: Type.Optional(Type.String()),
  copyright: Type.Optional(Type.String()),
  license: Type.Optional(Type.String()),
  encodedby: Type.Optional(Type.String()),
  encodersettings: Type.Optional(Type.String()),
  gapless: Type.Optional(Type.Boolean()),
  barcode: Type.Optional(Type.String()),
  isrc: Type.Optional(Type.Array(Type.String())),
  asin: Type.Optional(Type.String()),
  musicbrainz_recordingid: Type.Optional(Type.String()),
  musicbrainz_trackid: Type.Optional(Type.String()),
  musicbrainz_albumid: Type.Optional(Type.String()),
  musicbrainz_artistid: Type.Optional(Type.Array(Type.String())),
  musicbrainz_albumartistid: Type.Optional(Type.Array(Type.String())),
  musicbrainz_releasegroupid: Type.Optional(Type.String()),
  musicbrainz_workid: Type.Optional(Type.String()),
  musicbrainz_trmid: Type.Optional(Type.String()),
  musicbrainz_discid: Type.Optional(Type.String()),
  acoustid_id: Type.Optional(Type.String()),
  acoustid_fingerprint: Type.Optional(Type.String()),
  musicip_puid: Type.Optional(Type.String()),
  musicip_fingerprint: Type.Optional(Type.String()),
  website: Type.Optional(Type.String()),
  'performer:instrument': Type.Optional(Type.Array(Type.String())),
  averageLevel: Type.Optional(Type.Number()),
  peakLevel: Type.Optional(Type.Number()),
  notes: Type.Optional(Type.Array(Type.String())),
  originalalbum: Type.Optional(Type.String()),
  originalartist: Type.Optional(Type.String()),
  discogs_artist_id: Type.Optional(Type.Array(Type.Number())),
  discogs_release_id: Type.Optional(Type.Number()),
  discogs_label_id: Type.Optional(Type.Number()),
  discogs_master_release_id: Type.Optional(Type.Number()),
  discogs_votes: Type.Optional(Type.Number()),
  discogs_rating: Type.Optional(Type.Number()),
  replaygain_track_gain_ratio: Type.Optional(Type.Number()),
  replaygain_track_peak_ratio: Type.Optional(Type.Number()),
  replaygain_track_gain: Type.Optional(IRatio),
  replaygain_track_peak: Type.Optional(IRatio),
  replaygain_album_gain: Type.Optional(IRatio),
  replaygain_album_peak: Type.Optional(IRatio),
  replaygain_undo: Type.Optional(
    Type.Object({
      leftChannel: Type.Number(),
      rightChannel: Type.Number(),
    }),
  ),
  replaygain_track_minmax: Type.Optional(Type.Array(Type.Number())),
  replaygain_album_minmax: Type.Optional(Type.Array(Type.Number())),
  key: Type.Optional(Type.String()),
  category: Type.Optional(Type.Array(Type.String())),
  hdVideo: Type.Optional(Type.Number()),
  keywords: Type.Optional(Type.Array(Type.String())),
  movement: Type.Optional(Type.String()),
  movementIndex: Type.Object({
    no: Type.Union([Type.Number(), Type.Null()]),
    of: Type.Union([Type.Number(), Type.Null()]),
  }),
  podcastId: Type.Optional(Type.String()),
  showMovement: Type.Optional(Type.Boolean()),
  stik: Type.Optional(Type.Number()),
}, {
  title: 'ICommonTagsResult',
  description: 'Audio tags from the audio',
})

export type AudioPicture = IPicture
export type AudioTags = ICommonTagsResult
export const AudioTagsSchema = ICommonTagsResult
