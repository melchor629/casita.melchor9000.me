const checkSupport = (imageUrl: string) => new Promise<boolean>((resolve) => {
  const img = new Image()
  img.onload = () => {
    const result = img.width > 0 && img.height > 0
    resolve(result)
  }
  img.onerror = () => {
    resolve(false)
  }
  img.src = imageUrl
})

const support = {
  // webp with alpha channel
  webp: await checkSupport(
    'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/'
    + 'Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
  ),
  // avif
  avif: await checkSupport(
    'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQ'
    + 'AAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYw'
    + 'AAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAA'
    + 'amlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABN'
    + 'jb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///'
    + '8WfhwB8+ErK42A=',
  ),
}

export const hasWebpSupport = () => support.webp
export const hasAvifSupport = () => support.avif
