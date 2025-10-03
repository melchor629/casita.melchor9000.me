declare module '@picturae/mmmagic' {
  declare class Magic {
    constructor(msource: string | Buffer | false, flags: number)
    constructor(flags: number)
    detectFile(file: string, cbk: (err?: Error, value?: string) => void)
    detect(data: Buffer, cbk: (err?: Error, value?: string) => void)
  }

  declare const MAGIC_NONE: number
  declare const MAGIC_DEBUG: number
  declare const MAGIC_SYMLINK: number
  declare const MAGIC_DEVICES: number
  declare const MAGIC_MIME_TYPE: number
  declare const MAGIC_CONTINUE: number
  declare const MAGIC_CHECK: number
  declare const MAGIC_PRESERVE_ATIME: number
  declare const MAGIC_RAW: number
  declare const MAGIC_MIME_ENCODING: number
  declare const MAGIC_MIME: number
  declare const MAGIC_APPLE: number

  declare const MAGIC_NO_CHECK_TAR: number
  declare const MAGIC_NO_CHECK_SOFT: number
  declare const MAGIC_NO_CHECK_APPTYPE: number
  declare const MAGIC_NO_CHECK_ELF: number
  declare const MAGIC_NO_CHECK_TEXT: number
  declare const MAGIC_NO_CHECK_CDF: number
  declare const MAGIC_NO_CHECK_TOKENS: number
  declare const MAGIC_NO_CHECK_ENCODING: number

  // eslint-disable-next-line import-x/no-commonjs
  module.exports = {
    Magic,
    MAGIC_NONE,
    MAGIC_DEBUG,
    MAGIC_SYMLINK,
    MAGIC_DEVICES,
    MAGIC_MIME_TYPE,
    MAGIC_CONTINUE,
    MAGIC_CHECK,
    MAGIC_PRESERVE_ATIME,
    MAGIC_RAW,
    MAGIC_MIME_ENCODING,
    MAGIC_MIME,
    MAGIC_APPLE,
    MAGIC_NO_CHECK_TAR,
    MAGIC_NO_CHECK_SOFT,
    MAGIC_NO_CHECK_APPTYPE,
    MAGIC_NO_CHECK_ELF,
    MAGIC_NO_CHECK_TEXT,
    MAGIC_NO_CHECK_CDF,
    MAGIC_NO_CHECK_TOKENS,
    MAGIC_NO_CHECK_ENCODING,
  }
}
