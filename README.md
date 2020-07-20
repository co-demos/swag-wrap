
# @julpy/swag-wrap

[![GitHub license](https://img.shields.io/github/license/co-demos/swag-wrap)](https://github.com/co-demos/swag-wrap/blob/master/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap)

Simple swagger.json wrapper for Vue, to be used as a Vue plugin as simply as posible...

---------

## Install

```terminal
npm install @julpy/swag-wrap

... or for beta versions

npm install @julpy/swag-wrap@0.0.1-beta.19
```

---------

## Main dependencie(s)

- `swagger-client` : [github](https://github.com/swagger-api/swagger-js) - [documentation](https://github.com/swagger-api/swagger-js#readme) - [npm](https://www.npmjs.com/package/swagger-client)


---------

## Usage as vue plugin

### in your vue app's `.env` file

```env
VUE_APP_SWAGGER_URL=https://www.data.gouv.fr/api/1/swagger.json
VUE_APP_API_KEY=my-precious-api-personal-key
```

### in your vue app's `main.js` file

```js
import APIcli from '@julpy/swag-wrap'

...

const isDevMode = Boolean(process.env.VUE_APP_DEV_MODE)

const swagWrapOptions = {
  // get back your swagger json url and other options here
  swaggerUrl: process.env.VUE_APP_SWAGGER_URL,
  apiKey: process.env.VUE_APP_API_KEY,
}

// inject your API client plugin into your vue app
Vue.use(APIcli, options)

...

```

### in any of your vue app's components

```vue
<template>
  <!-- my vue component -->
  <div>

    <div v-if="datasets">
      <!-- the data will be loaded, here as a boostrap table -->
      <b-table striped hover :items="datasets.data"></b-table>
    </div>
    <div v-else>
      ... loading Datasets
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      // declare your endpoint's operationId
      // this part is relative to your swagger specs
      operationId_get_list: 'list_datasets',
      operationId_get_one: 'get_dataset',
      operationId_put_one: 'update_dataset',

      // the data you want to load and then display
      datasets: undefined
    }
  },
  created () {
    // get your swag-wrap client instance
    const API = this.$APIcli

    // - - - - - - - - - - - - - - - - - //
    // GET endpoint without parameters
    // - - - - - - - - - - - - - - - - - //
    // request data from the desired path
    API._request(this.operationId_get_list).then(
      results => {
        // ... do something with the result
        this.datasets = results.body

        /*
        you can access the following keys in the `results` response :
        - `body` : object
        - `data` : string | json
        - `headers` : object
        - `obj` : object
        - `ok` : bool
        - `status` : int
        - `statusText` :
        - `text` : string | json
        - `url` : string
        */
      },
      reason => console.error('failed on api call: ' + reason)
    )

    // - - - - - - - - - - - - - - - - - //
    // GET endpoint with parameters
    // - - - - - - - - - - - - - - - - - //
    // prepare parameters for this endpoint
    const parameters = {
      dataset: 'my-dataset-id',
    }
    // request data from the desired path
    API._request(this.operationId_get_one, { parameters } ).then(
      results => {
        // ... do something with the result
        this.datasets = results.body
      },
      reason => console.error('failed on api call: ' + reason)
    )

    // - - - - - - - - - - - - - - - - - //
    // PUT endpoint with parameters
    // - - - - - - - - - - - - - - - - - //
    // prepare parameters for this endpoint
    const parameters = {
      dataset: this.datasetId
      payload: {
        title: `updated-title-random`,
        description: `an updated description ... `
      }
    }
    const body = {
      uGotAVery: '... nice body'
    }
    // PUT/POST data from the desired path
      API._request(this.operationId_put_one, { parameters, body, needAuth: true }).then(
      results => {
        // ... do something with the result
        this.datasets = results.body
      },
      reason => console.error('failed on api call: ' + reason)
    )

  }
}
</script>
```

---------

## Usage as plugin

```js
import { SwagCli } from '@julpy/swag-wrap'

// initiate the api client from the swagger json
const swagWrapOptions = {
  swaggerUrl: 'https://www.data.gouv.fr/api/1/swagger.json',
  apiKey: 'my-precious-api-personal-key',
}
const mySwaggerClient = new SwagCli(options)

// use your client to request the api
// simple `get` example
const operationId = 'get_dataset'
const parameters = {
  dataset: 'my-dataset-id',
}
const myRequest = mySwaggerClient(operationId, { parameters }).then( results => {
  console.log(results)
  // ... do something with the results
})
```
