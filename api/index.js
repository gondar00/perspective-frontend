import axios from 'axios'

function camelCase(str) {
    return str.replace( /(\-\w)/g, (matches) => matches[1].toUpperCase())
  }

class API {
  constructor(url = ''){
    this.url = url
    this.endpoints = {}
  }

  createEntity(name) {
    const _name = camelCase(name)
    this.endpoints[name] = this.createEndpoints(_name)
  }

  /**
   * Create the basic endpoints handlers for CRUD operations
   */
  createEndpoints(name) {
    let endpoints = {}

    const resourceURL = `${this.url}/${name}`

    endpoints.getAll = (query, config={}) => axios.get(resourceURL, Object.assign({ params: { query }}, config))
    endpoints.getOne = (id, config={}) =>  axios.get(`${resourceURL}/${id}`, config)
    endpoints.create = (toCreate, config={}) =>  axios.post(resourceURL, toCreate, config)
    endpoints.update = (toUpdate, config={}) => axios.put(`${resourceURL}/${toUpdate.id}`, toUpdate, config)
    endpoints.patch  = (id, toPatch, config={}) => axios.patch(`${resourceURL}/${id}`, toPatch, config)
    endpoints.delete = (id, config={}) => axios.delete(`${resourceURL}/${id}`)

    return endpoints
  }

}

export default API