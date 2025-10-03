// eslint-disable-next-line import-x/prefer-default-export
export const chunks = <T>(array: T[], chunkSize: number): T[][] => {
  const result: T[][] = []
  while (result.length * chunkSize < array.length) {
    result.push(array.slice(
      result.length * chunkSize,
      (result.length * chunkSize) + chunkSize,
    ))
  }
  return result
}
