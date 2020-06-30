import SwaggerClient from 'swagger-client'

class SwagCli {
  constructor (spec) {
    console.log('>>> SwagCli > spec : ', spec)
    // create swagger client
    this.cli = new SwaggerClient(spec)
  }

  _request (pathTagList, data) {
    return this.cli.then(
      client => client.apis[pathTagList[0]][pathTagList[1]](),
      reason => console.error('--- apiClient > _request > failed to load the spec: ' + reason)
    )
  }
}

const APIcli = {
  install (Vue, options) {
    const spec = options.swaggerUrl
    Vue.prototype.$APIcli = new SwagCli(spec)
  }
}
export default APIcli
