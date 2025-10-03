export interface AppJobData {
  appIdentifier: string
}

export type WithAppJobData<T extends object = object> = T & AppJobData
