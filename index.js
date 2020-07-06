import SwaggerClient from 'swagger-client'

class SwagCli {
  constructor (options) {
    // retrieve spec from options
    this.spec = options.swaggerUrl
    console.log('>>> SwagCli > init > this.spec : ', this.spec)

    // retrieve API key options
    this.apiKey = options.apiKey
    this.bearerAuth = options.bearerAuth
    this.userName = options.userName
    this.userPassword = options.userPassword
    this.token = options.token
    this.customAuthHeader = options.customAuthHeader

    // create swagger client from spec
    this.specAndAuth = { url: this.spec }

    // add auth to spec if necessary
    if (this.apiKey) {
      // this.specAndAuth.authorization = { ApiKey: { value: this.apiKey } }
      // this.specAndAuth.authorization = { Authorization: { 'X-API-KEY': this.apiKey } }
      this.specAndAuth.authorization = { 'X-API-KEY': this.apiKey }
    } else if (this.bearerAuth) {
      this.specAndAuth.authorization = { BearerAuth: { value: this.bearerAuth } }
    } else if (this.userPassword) {
      this.specAndAuth.authorization = { BasicAuth: { username: this.userName, password: this.userPassword } }
    } else if (this.token) {
      this.specAndAuth.authorization = { oAuth2: { token: { access_token: this.token } } }
    } else if (this.customAuthHeader && this.apiKey) {
      const customHeader = {}
      customHeader[this.customAuthHeader] = this.apiKey
      this.specAndAuth.authorization = customHeader
    }

    // activate CORS or not
    // if (options.activateCORS) {
    //   SwaggerClient.http.withCredentials = true
    // }

    // instantiate client
    this.cli = new SwaggerClient(this.specAndAuth)

    // set up security definitions
    // this.security = undefined
    // this._setSecurity()
  }

  // _setSecurity () {
  //   // cf : https://github.com/swagger-api/swagger-js/blob/HEAD/docs/usage/http-client.md
  //   // console.log('>>> SwagCli > _setSecurity ...')
  //   return this.cli.then(
  //     client => {
  //       // console.log('>>> SwagCli > _setSecurity >> client.spec.securityDefinitions : ', client.spec.securityDefinitions)
  //       this.security = client.spec.securityDefinitions
  //     }
  //   )
  // }

  _requestInterceptor (req, needAuth) {
    // swagger client request interceptor
    const authHeader = this.specAndAuth.authorization

    // update request's headers
    req.headers = needAuth ? {
      ...req.headers,
      ...authHeader
    } : req.headers

    // update request's mode
    // req.mode = needAuth ? 'cors' : 'same-origin'
    // req.mode = 'cors'

    // update request's credentials
    // req.credentials = needAuth ? 'include' : 'same-origin'
    // req.credentials = 'omit'

    console.log('>>> SwagCli > requestInterceptor >> req : ', req)
    return req
  }

  _request (operationId, { params, body, needAuth } = {}) {
    // main request function
    // arg :: operationId : string / endpoint's operation ID
    return this.cli.then(
      // once client is ready trigger the api's path
      client => {
        console.log('- - - NEW REQUEST vvv', '- '.repeat(20))
        // get endpoint by resolving endpoint's path in client.apis
        console.log('>>> SwagCli > _request >> client : ', client)
        console.log('>>> SwagCli > _request >> operationId : ', operationId)
        params && console.log('>>> SwagCli > _request >> params : ', params)
        body && console.log('>>> SwagCli > _request >> body : ', body)

        // build request
        let request = {
          operationId: operationId,
          requestInterceptor: req => this._requestInterceptor(req, needAuth)
        }
        request = params ? { ...request, parameters: params } : request
        request = body ? { ...request, body: body } : request

        // execute request
        const endpoint = client.execute(request)
        console.log('>>> SwagCli > _request >> endpoint (Promise): ', endpoint)
        return endpoint
      },
      reason => console.error('>>> SwagCli > _request >> failed to execute the request : ' + reason)
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

// // Automatic installation if Vue has been added to the global scope.
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(APIcli)
// }
