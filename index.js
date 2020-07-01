import SwaggerClient from 'swagger-client'

// const resolvePath = (path, obj = self, separator = '.') => {
//   const properties = Array.isArray(path) ? path : path.split(separator)
//   return properties.reduce((prev, curr) => prev && prev[curr], obj)
// }

class SwagCli {
  constructor (options) {
    // this.options = options

    // retrieve spec from options
    this.spec = options.swaggerUrl
    console.log('>>> SwagCli > init > this.spec : ', this.spec)

    // retrieve API key options
    this.apiKey = options.apiKey
    this.bearerAuth = options.bearerAuth
    this.userName = options.userName
    this.userPassword = options.userPassword
    this.token = options.token

    // retrieve separator (optional)
    this.tagsSeparator = options.separator ? options.separator : '.'

    // create swagger client from spec
    let specAndAuth = { url: this.spec }

    // add auth to spec if necessary
    if (this.apiKey) {
      specAndAuth.authorization = { ApiKey: { value: this.apiKey } }
    } else if (this.bearerAuth) {
      specAndAuth.authorization = { BearerAuth: { value: this.bearerAuth } }
    } else if (this.userPassword) {
      specAndAuth.authorization = { BasicAuth: { username: this.userName, password: this.userPassword } }
    } else if (this.token) {
      specAndAuth.authorization = { oAuth2: { token: { access_token: this.token } } }
    }

    // append interceptor
    const requestInterceptor = this._requestInterceptor
    specAndAuth = { ...specAndAuth, requestInterceptor }

    // activate CORS or not
    if (options.activateCORS) {
      SwaggerClient.http.withCredentials = true
    }

    // instantiate client
    this.cli = new SwaggerClient(specAndAuth)

    // set up security definitions
    this.security = undefined
    this._setSecurity()
  }

  _setSecurity () {
    // cf : https://github.com/swagger-api/swagger-js/blob/HEAD/docs/usage/http-client.md
    // console.log('>>> SwagCli > _setSecurity ...')
    return this.cli.then(
      client => {
        // console.log('>>> SwagCli > _setSecurity >> client.spec.securityDefinitions : ', client.spec.securityDefinitions)
        this.security = client.spec.securityDefinitions
      }
    )
  }

  _requestInterceptor (request) {
    console.log('>>> SwagCli > _requestInterceptor > request :', request)
    if (request.loadSpec) {
      console.log('>>> SwagCli > _requestInterceptor > request.loadSpec :', request.loadSpec)
    }
    return request
  }

  _request (operationId, params) {
    // main request function
    // arg :: pathTagList : array|string of tags corresponding to your endpoint's path
    // arg :: operationId : string / endpoint's opeation ID
    return this.cli.then(
      // once client is ready trigger the api's path
      client => {
        console.log('- '.repeat(20))
        // get endpoint by resolving endpoint's path in client.apis
        console.log('>>> SwagCli > _request >> client : ', client)
        console.log('>>> SwagCli > _request >> operationId : ', client)

        if (this.security && this.apiKey) {
          console.log('>>> SwagCli > _request >> this.security : ', this.security)
          console.log('>>> SwagCli > _request >> this.apiKey : ', this.apiKey)
        }

        // build endpoint
        // const endpoint = resolvePath(pathTagList, client.apis, this.tagsSeparator)
        // return endpoint(params)

        const _requestInterceptor = this._requestInterceptor
        const endpoint = client.execute({
          operationId: operationId,
          parameters: params,
          _requestInterceptor
        })
        console.log('>>> SwagCli > _request >> endpoint : ', endpoint)
        return endpoint
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
