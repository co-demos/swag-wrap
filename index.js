import axios from 'axios'

function getSwaggerJson (url) {
  try {
    let response = axios.get(url)
    return response
  } catch (error) {
    console.error(error)
  }
}

class APILib {
  constructor (options) {
    console.log('>>> APILib > options : ', options)
    this.options = options
    const protocol = this.options.protocol || 'https'
    this.swaggerURL = `${protocol}://${this.options.swaggerUrl}`
    this.apiVersion = this.options.apiVersion ? this.options.apiVersion : ''
    this.apiServerURL = `${protocol}://${this.options.apiDomain}${this.apiVersion}`

    this.swaggerObject = undefined
    this.swaggerPaths = undefined

    let getJson = getSwaggerJson(this.swaggerURL)
    .then(res => {
      this.swaggerObject = res.data
      this.swaggerPaths = res.data.paths
      return res
    })
    Promise.all([getJson])
    .then( res => {
      console.log('>>> APILib > Promise.all.then > this.swaggerObject :', this.swaggerObject)
      return
    })
  }

  _get (path, params) {
    params = params || {}
    console.log('>>> APILib > _get > this.apiServerURL :', this.apiServerURL)
    console.log('>>> APILib > _get > path :', path)
    return axios.get(`${this.apiServerURL}${path}`, { params: params })
      .then(res => {
        console.log('>>> APILib > _get > res :', res)
        return res.data
        // return res.body
      })
      .catch(function (error) {
      // handle error
        console.log('>>> APILib > _get > error :', error)
      })
  }

  _put (path, data) {
    return axios.put(`${this.apiServerURL}${path}`, data)
      .then(res => {
        return res.body
      })
      .catch(function (error) {
      // handle error
        console.log('>>> APILib > _put > error :', error)
        console.log(error)
      })
  }

  getSwagerObject () {
    return this.swaggerObject
  }
  getSwagerPaths () {
    return this.swaggerPaths
  }

  getDatasets () {
    console.log('>>> APILib > getDatasets > ... ')
    return this._get('/datasets/')
  }

  getDataset (id) {
    return this._get(`/datasets/${id}/`)
  }
}

// module.export.APILib = APILib
export default APILib
