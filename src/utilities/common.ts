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

export const dataMapping = (
  data:
    | {
        [key: string]: any
      }
    | Array<any>
) => {
  return { data }
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

export const myMapOmit = (data: any[], toOmit: string[]) => {
  return _.map(data, (item) => _.omit(item, toOmit))
}

export const myMapPick = (data: any[], toOmit: string[]) => {
  return _.map(data, (item) => _.pick(item, toOmit))
}
