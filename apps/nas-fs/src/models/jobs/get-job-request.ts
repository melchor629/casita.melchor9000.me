import type { JobState } from 'bullmq'
import { StringEnum, Type, type Static } from '../type-helpers.ts'

export const GetJobResponseSchema = Type.Object({
  attemptsMade: Type.Number(),
  data: Type.Unknown(),
  failedReason: Type.Optional(Type.String()),
  finishedOn: Type.Optional(Type.Number()),
  id: Type.String(),
  name: Type.String(),
  processedOn: Type.Optional(Type.Number()),
  progress: Type.Union([
    Type.Number(),
    Type.Record(Type.String(), Type.Unknown()),
  ]),
  stackTrace: Type.Array(Type.Unknown()),
  returnValue: Type.Unknown(),
  timestamp: Type.Number(),
  state: StringEnum<Array<JobState | 'unknown'>>([
    'active',
    'completed',
    'delayed',
    'failed',
    'prioritized',
    'waiting',
    'waiting-children',
    'unknown',
  ]),
}, {
  title: 'GetJobResponse',
})

export type GetJobResponse = Static<typeof GetJobResponseSchema>
