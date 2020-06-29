import axios from 'axios'

class APILib {
  constructor (options) {
    this.options = options
    const protocol = this.options.protocol || 'https'
    this.swaggerURL = `${protocol}://${this.options.swaggerUrl}`
    this.apiVersion = this.options.apiVersion ? this.options.apiVersion : '' // `/api/1`
    this.apiServerURL = `${protocol}://${this.options.apiDomain}${this.apiVersion}`

    this.swaggerObject = undefined
    axios.get(this.swaggerURL)
      .then(res => {
        this.swaggerObject = JSON.parse(res)
      })
    console.log('>>> APILib > this.swaggerObject : \n', this.swaggerObject)
  }

  _get (path, params) {
    params = params || {}
    // TODO: handle errors
    return axios.get(`${this.apiServerURL}/${path}`, { params: params })
      .then(res => {
        return res.body
      })
      .catch(function (error) {
      // handle error
        console.log('>>> APILib > _get > error :', error)
      })
  }

  _put (path, data) {
    return axios.put(`${this.apiServerURL}/${path}`, data)
      .then(res => {
        return res.body
      })
      .catch(function (error) {
      // handle error
        console.log('>>> APILib > _put > error :', error)
        console.log(error)
      })
  }

  getDatasets () {
    return this._get('datasets/')
  }

  getDataset (id) {
    return this._get(`datasets/${id}/`)
  }
}

module.export.APILib = APILib
