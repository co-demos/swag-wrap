
# @julpy/swag-wrap

[![GitHub license](https://img.shields.io/github/license/co-demos/swag-wrap)](https://github.com/co-demos/swag-wrap/blob/master/LICENSE) [![npm (scoped)](https://img.shields.io/npm/v/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap) [![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/@julpy/swag-wrap.svg)](https://www.npmjs.com/package/@julpy/swag-wrap)

Simple swagger.json wrapper for Vue, to be used as a Vue plugin as simply as posible...

---------
## Install

```terminal
npm install @julpy/swag-wrap

... or for beta versions

npm install @julpy/swag-wrap@0.0.1-beta.15
```

-------
## Usage

#### in your vue app's `.env` file
```env
VUE_APP_SWAGGER_URL=https://www.data.gouv.fr/api/1/swagger.json
```

#### in your vue app's `main.js` file
```js
import APIcli from '@julpy/swag-wrap'

...

const options = {
  // get back your swagger json url and other options here
  swaggerUrl: process.env.VUE_APP_SWAGGER_URL,
  separator: '.' // optionnal
}
// inject your API client plugin into your vue app
Vue.use(APIcli, options)

...

```

#### in any of your vue app's components

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
      // define the path of your endpoint(s)
      // both ways (paths as array or string) works
      // this part is relative to your swagger specs
      // note the order is important
      endpointPathArray: ['datasets', 'list_datasets'],
      endpointPathString: 'datasets.list_datasets',

      // the data you want to load and then display
      datasets: undefined
    }
  },
  created () {
    // get your swag-wrap client instance
    const API = this.$APIcli

    // request data from the desired path
    API._request(this.endpointPathString).then(
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
  }
}
</script>
```

--------
## Main dependencie(s)

- `swagger-client` : [github](https://github.com/swagger-api/swagger-js) - [documentation](https://github.com/swagger-api/swagger-js#readme) - [npm](https://www.npmjs.com/package/swagger-client)
