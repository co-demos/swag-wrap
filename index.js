import SwaggerClient from 'swagger-client'

class SwagCli {
  constructor (options, store) {
    this.store = store
    // retrieve spec from options
    this.spec = options.swaggerUrl
    console.log('>>> SwagCli > init > this.spec : ', this.spec)

    // instantiate client
    this.resetCli(options)

    // set up security definitions
    // this.security = undefined
    // this._setSecurity()
  }

  buildSpecAndAuth (options) {
    // create swagger client from spec
    const specAndAuth = { url: this.spec }

    // add auth to spec if necessary
    if (options.apiKey) {
      // this.specAndAuth.authorization = { ApiKey: { value: this.apiKey } }
      // this.specAndAuth.authorization = { Authorization: { 'X-API-KEY': this.apiKey } }
      specAndAuth.authorization = { 'X-API-KEY': options.apiKey }
    } else if (options.bearerAuth) {
      specAndAuth.authorization = { BearerAuth: { value: options.bearerAuth } }
    } else if (options.userPassword) {
      specAndAuth.authorization = { BasicAuth: { username: options.userName, password: options.userPassword } }
    } else if (options.token) {
      specAndAuth.authorization = { oAuth2: { token: { access_token: options.token } } }
    } else if (options.customAuthHeader && options.apiKey) {
      const customHeader = {}
      customHeader[options.customAuthHeader] = options.apiKey
      specAndAuth.authorization = customHeader
    }
    return specAndAuth
  }

  resetCli (authOptions) {
    this.specAndAuth = this.buildSpecAndAuth(authOptions)
    // activate CORS or not
    // if (authOptions.activateCORS) {
    //   SwaggerClient.http.withCredentials = true
    // }
    this.setStore()
    this.cli = new SwaggerClient(this.specAndAuth)
  }

  setStore () {
    this.store && this.store.commit('swagapi/setSpecs', this.specAndAuth)
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

// vue store module within plugin just for auth
export const moduleApiClient = {
  namespaced: true,
  state: () => ({
    specs: undefined
  }),
  getters: {},
  mutations: {
    setSpecs (state, specs) {
      state.specs = specs
    }
  },
  actions: {},
  modules: {}
}

const APIcli = {
  install (Vue, options, store) {
    // register namespaced store i necessary
    if (options.registerApiStore && store) {
      const moduleName = options.storeModuleName ? options.storeModuleName : 'swagwrap'
      store.registerModule(moduleName, moduleApiClient)
    }

    // declare client as a global prototype in Vue
    Vue.prototype.$APIcli = new SwagCli(options, store)
  }
}
export default APIcli

// // Automatic installation if Vue has been added to the global scope.
// if (typeof window !== 'undefined' && window.Vue) {
//   window.Vue.use(APIcli)
// }
