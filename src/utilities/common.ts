import _ from 'lodash'

export const dataMappingSuccess = (
  data:
    | {
        [key: string]: any
      }
    | Array<any>,
  msg?: string
) => {
  return { data, message: msg || 'Success' }
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
