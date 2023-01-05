import _ from 'lodash'
interface IDataMappingSuccess {
  data:
    | {
        [key: string]: any
      }
    | Array<any>
  pagination?: {
    [key: string]: any
  }
  msg?: string
}

export const dataMappingSuccess = ({ data, msg, pagination }: IDataMappingSuccess) => {
  return { data, pagination, message: msg || 'Success' }
}

export const dataMapping = <T>(data: T) => {
  return { data }
}

export const errorMapping = <T>(msg: T) => {
  return {
    error: {
      msg: msg,
    },
  }
}

export const findObjectById = ({ arr, id }: { arr: Array<any>; id: String }) => {
  return _.find(arr, (item) => (item.id || item.inviteId) === id)
}

export const noAuthRoutesToArr = (obj: any, route: string) =>
  Object.entries(obj).map(([_, value]) => {
    return route + value
  })

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

export const myMapOmit = <T>(data: T[], toOmit: string[]) => {
  return _.compact(_.map(data, (item) => (item ? _.omit(item, toOmit) : null)))
}

export const myMapPick = <T>(data: T[], toPick: string[]) => {
  return _.compact(_.map(data, (item) => (item ? _.pick(item, toPick) : null)))
}

export const numberInputs = (
  input: any
): {
  [key: string]: number
} =>
  Object.keys(input).reduce((acc: any, val: any) => {
    acc[val] = +input[val] as number
    return acc
  }, {})

export const genPagination = (page: number, perPage: number, arrayLength: number) => {
  return {
    page: page,
    perPage: perPage,
    pageCount: Math.ceil(arrayLength / perPage),
    totalCount: arrayLength,
  }
}

export function asyncMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<U>
): Promise<U[]> {
  return Promise.all(_.map(array, callbackfn))
}

export const asyncFilter = async <T>(
  arr: T[],
  callbackfn: (value: T, index: number, array: T[]) => Promise<boolean>
): Promise<T[]> => Promise.all(_.map(arr, callbackfn)).then((results) => _.filter(arr, (_v, index) => results[index]))
