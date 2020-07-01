import SwaggerClient from 'swagger-client'

const resolvePath = (path, obj = self, separator = '.') => {
  const properties = Array.isArray(path) ? path : path.split(separator)
  return properties.reduce((prev, curr) => prev && prev[curr], obj)
}

class SwagCli {
  constructor (options) {
    // retrieve spec from options
    this.spec = options.swaggerUrl
    console.log('>>> SwagCli > init > this.spec : ', this.spec)

    // retrieve separator
    this.tagsSeparator = options.separator ? options.separator : '.'

    // create swagger client from spec
    this.cli = new SwaggerClient(this.spec)
  }

  _request (pathTagList, data) {
    // main request function
    // arg :: pathTagList : array|string of tags corresponding to your endpoint's path
    // note : the order is important
    return this.cli.then(
      // once client is ready trigger the api's path
      client => {
        // get endpoint by resolving endpoint's path in client.apis
        const endpoint = resolvePath(pathTagList, client.apis, this.tagsSeparator)
        // console.log('>>> SwagCli > _request >> endpoint : ', endpoint)
        return endpoint(data)
      },
      reason => console.error('>>> SwagCli > _request >> failed to load the spec: ' + reason)
    )
  }
}

const APIcli = {
  install (Vue, options) {
    // declare client as a global prototype in Vue
    Vue.prototype.$APIcli = new SwagCli(options)
  }
}
export default APIcli
