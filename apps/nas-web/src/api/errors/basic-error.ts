export interface BasicError<Code extends number, Type extends string> {
  status: Code
  message: string
  type: Type
}
