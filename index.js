import axios from 'axios'

class APILib {

  constructor (options) {
    this.options = options
    const protocol = this.options.protocol || 'https'
    this.swaggerURL = `${protocol}://${this.options.swagger}`
    this.apiVersion = this.options.apiVersion // `/api/1`
    this.apiServerURL = `${protocol}://${this.options.domain}${this.apiVersion}`
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
      console.log(error);
    })
  }

  _put (path, data) {
    return axios.put(`${this.apiServerURL}/${path}`, data)
    .then(res => {
      return res.body
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
  }

  getDatasets () {
    return this._get(`datasets/`)
  }

  getDataset (id) {
    return this._get(`datasets/${id}/`)
  }

}


module.exports = (options) => {
  // const DGFApi = {
  //   install (Vue, options) {
  //     if (!Vue.http) {
  //       return console.error('dgf-api requires vue-resource')
  //     }
  //     Vue.prototype.$dgfApi = new APILib(options)
  //   }
  // }
  return new APILib(options)
}

