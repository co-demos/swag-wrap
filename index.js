import SwaggerClient from 'swagger-client'

class SwagCli {
  constructor (spec) {
    console.log('>>> SwagCli > spec : ', spec)
    // create swagger client from spec
    this.cli = new SwaggerClient(spec)
  }

  _request (pathTagList, data) {
    // main request function
    // pathTagList
    return this.cli.then(
      // 
      client => client.apis[pathTagList[0]][pathTagList[1]]( data ),
      reason => console.error('>>> SwagCli > _request > failed to load the spec: ' + reason)
    )
  }
}

const APIcli = {
  install (Vue, options) {
    // get back options injected from vue
    const spec = options.swaggerUrl

    // declare client as a global prototype in Vue
    Vue.prototype.$APIcli = new SwagCli(spec)
  }
}
export default APIcli
